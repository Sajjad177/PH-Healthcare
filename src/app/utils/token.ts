import { JwtPayload } from 'jsonwebtoken';
import { jwtUtils } from './jwt';
import { envConfig } from '../../config/env';
import ms, { StringValue } from 'ms';
import { Response } from 'express';
import { cookieUtils } from './cookie';

const getAccessToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(
    payload,
    envConfig.ACCESS_TOKEN_SECRET,
    envConfig.ACCESS_TOKEN_EXPIRE_IN as StringValue,
  );
};

const getRefreshToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(
    payload,
    envConfig.REFRESH_TOKEN_SECRET,
    envConfig.REFRESH_TOKEN_EXPIRE_IN as StringValue,
  );
};

const setAccessTokenCookie = (res: Response, token: string) => {
  const maxAge = ms(envConfig.ACCESS_TOKEN_EXPIRE_IN as StringValue);

  cookieUtils.setCookie(res, 'accessToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge,
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  const maxAge = ms(envConfig.REFRESH_TOKEN_EXPIRE_IN as StringValue);

  cookieUtils.setCookie(res, 'refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge,
  });
};

const setBatterAuthSessionCookie = (res: Response, token: string) => {
  const maxAge = ms(envConfig.BATTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue);

  cookieUtils.setCookie(res, 'better-auth.session_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge,
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBatterAuthSessionCookie,
};
