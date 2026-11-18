import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { envConfig } from '../../config/env';
import { Role, userStatus } from '../../generated/prisma/enums';
import AppError from '../errorHelpers/AppError';
import { prisma } from '../lib/prisma';
import { cookieUtils } from '../utils/cookie';
import { jwtUtils } from '../utils/jwt';

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Get access token from Authorization header or cookie
      const authHeader = req.headers.authorization;
      let accessToken: string | undefined;

      if (authHeader) {
        const [scheme, token, ...extra] = authHeader.trim().split(/\s+/);

        if (scheme?.toLowerCase() !== 'bearer' || !token || extra.length > 0) {
          throw new AppError(
            'Invalid authorization header. Use Bearer token.',
            status.UNAUTHORIZED,
          );
        }

        accessToken = token;
      } else {
        accessToken = cookieUtils.getCookie(req, 'accessToken');
      }

      if (!accessToken) {
        throw new AppError(
          'Authentication required. Please provide an access token.',
          status.UNAUTHORIZED,
        );
      }

      // 2. Verify access token
      let verifiedToken;

      try {
        verifiedToken = jwtUtils.verifyToken(accessToken, envConfig.ACCESS_TOKEN_SECRET);
      } catch {
        throw new AppError(
          'Your access token is invalid or expired. Please log in again.',
          status.UNAUTHORIZED,
        );
      }

      // 3. Validate token payload
      const tokenData = verifiedToken.data;

      if (!tokenData || typeof tokenData === 'string' || typeof tokenData.userId !== 'string') {
        throw new AppError('Invalid authentication token payload.', status.UNAUTHORIZED);
      }

      // 4. Get Better Auth session token
      const sessionToken = cookieUtils.getCookie(req, 'better-auth.session_token');

      if (!sessionToken) {
        throw new AppError('Your session is missing. Please log in again.', status.UNAUTHORIZED);
      }

      // 5. Verify session from database
      const session = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!session || !session.user) {
        throw new AppError(
          'Your session is invalid or has expired. Please log in again.',
          status.UNAUTHORIZED,
        );
      }

      const user = session.user;

      // 6. Verify token identity matches session user
      // FIX: JWT payload contains userId, not id
      if (tokenData.userId !== user.id) {
        throw new AppError(
          'Authentication token does not belong to this user.',
          status.UNAUTHORIZED,
        );
      }

      // 7. Check user status
      if (user.status === userStatus.BLOCKED) {
        throw new AppError(
          'Your account has been blocked. Please contact support.',
          status.FORBIDDEN,
        );
      }

      if (user.status === userStatus.DELETED || user.isDeleted) {
        throw new AppError('This account is no longer available.', status.FORBIDDEN);
      }

      // 8. Role-based authorization
      // Always use the database role instead of JWT role
      if (authRoles.length > 0 && !authRoles.includes(user.role)) {
        throw new AppError('You do not have permission to access this resource.', status.FORBIDDEN);
      }

      // 9. Session expiration warning
      const now = Date.now();
      const expiresAt = session.expiresAt.getTime();
      const createdAt = session.createdAt.getTime();

      const sessionLifeTime = expiresAt - createdAt;
      const timeRemaining = expiresAt - now;

      if (
        sessionLifeTime > 0 &&
        timeRemaining > 0 &&
        (timeRemaining / sessionLifeTime) * 100 <= 20
      ) {
        res.setHeader('X-Session-Refresh', 'true');
        res.setHeader('X-Session-Expires-At', session.expiresAt.toISOString());
        res.setHeader('X-Session-Time-Remaining', timeRemaining.toString());
      }

      // 10. Attach authenticated user to request
      // If you have a custom Express Request type, use it here.
      // req.user = user;

      return next();
    } catch (error) {
      return next(error);
    }
  };
