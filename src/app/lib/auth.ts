import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { Role, userStatus } from '../../generated/prisma/enums';
import ms, { StringValue } from 'ms';
import { envConfig } from '../../config/env';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        default: Role.PATIENT,
      },

      status: {
        type: 'string',
        required: false,
        default: userStatus.ACTIVE,
      },

      needPasswordChange: {
        type: 'boolean',
        required: false,
        default: false,
      },

      isDeleted: {
        type: 'boolean',
        required: false,
        default: false,
      },

      deletedAt: {
        type: 'date',
        required: false,
        default: null,
      },
    },
  },

  session: {
    expiresIn: ms(envConfig.BATTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue) / 1000,

    updateAge: ms(envConfig.BATTER_AUTH_SESSION_TOKEN_UPDATE_AGE as StringValue) / 1000,

    cookieCache: {
      enabled: true,
      maxAge: ms(envConfig.BATTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue) / 1000,
    },
  },

  // trustedOrigin: process.env.TRUSTED_ORIGIN || 'http://localhost:5000',
  // advanced: {
  //   disableCSRFCheck: true,
  // },
});
