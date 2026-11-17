import { JwtPayload } from 'jsonwebtoken';
import { jwtUtils } from './jwt';
import { envConfig } from '../../config/env';
import { StringValue } from 'ms';

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envConfig.ACCESS_TOKEN_SECRET,
    envConfig.ACCESS_TOKEN_EXPIRE_IN as StringValue,
  );

  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envConfig.REFRESH_TOKEN_SECRET,
    envConfig.REFRESH_TOKEN_EXPIRE_IN as StringValue,
  );

  return refreshToken;
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
};
