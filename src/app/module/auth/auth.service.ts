import { userStatus } from '../../../generated/prisma/client';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

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

  //TODO: create profile for patient in user model.
  //   const patient = await prisma.$transaction(async (tx) => {});

  return data;
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

  return data;
};

//! next start in milestone: 6 module : 38

const authService = {
  registerPatient,
  loginUser,
};

export default authService;
