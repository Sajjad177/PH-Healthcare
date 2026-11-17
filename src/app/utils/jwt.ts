import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { StringValue } from 'ms';

const createToken = (payload: JwtPayload, secret: string, expiresIn?: number | StringValue) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

const decodeToken = (token: string) => {
  const decoded = jwt.decode(token);
  return decoded;
};

export const jwtUtils = {
  createToken,
  verifyToken,
  decodeToken,
};
