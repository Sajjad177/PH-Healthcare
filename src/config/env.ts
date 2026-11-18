import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRE_IN: string;
  REFRESH_TOKEN_EXPIRE_IN: string;
  BATTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string;
  BATTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
}

const loadEnvConfig = (): EnvConfig => {
  const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRE_IN',
    'REFRESH_TOKEN_EXPIRE_IN',
    'BATTER_AUTH_SESSION_TOKEN_EXPIRES_IN',
    'BATTER_AUTH_SESSION_TOKEN_UPDATE_AGE',
  ];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is not set`);
    }
  }

  return {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    DATABASE_URL: process.env.DATABASE_URL!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN!,
    REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN!,
    BATTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BATTER_AUTH_SESSION_TOKEN_EXPIRES_IN!,
    BATTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BATTER_AUTH_SESSION_TOKEN_UPDATE_AGE!,
  };
};

export const envConfig = loadEnvConfig();
