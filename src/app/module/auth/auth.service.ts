import { userStatus } from '../../../generated/prisma/client';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { tokenUtils } from '../../utils/token';

interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

const registerPatient = async (payload: RegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new Error('Failed to register patient');
  }

  try {
    const patient = await prisma.$transaction(async (tx: any) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name,
          email,
        },
      });

      return patientTx;
    });

    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return {
      ...data,
      accessToken,
      refreshToken,
      patient,
    };
  } catch (error) {
    // if patient creation fails, delete the user from auth and throw an error
    console.error('Error creating patient:', error);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw new Error('Failed to register patient');
  }
};

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  const { user } = data;
  if (user.status === userStatus.DELETED) {
    throw new Error('User is deleted');
  }

  if (user.status === userStatus.BLOCKED) {
    throw new Error('User is blocked');
  }

  if (!user) {
    throw new Error('Failed to login user');
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const authService = {
  registerPatient,
  loginUser,
};

export default authService;
