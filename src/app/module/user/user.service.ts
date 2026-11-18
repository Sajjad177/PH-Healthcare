import { Role, Specialty } from '../../../generated/prisma/client';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { ICreateAdmin, ICreateDoctor } from './user.interface';

const createDoctor = async (payload: ICreateDoctor) => {
  const specialties: Specialty[] = [];

  for (const specialtyId of payload.specialty) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new Error(`Specialty with ID ${specialtyId} not found`);
    }

    specialties.push(specialty);
  }

  const isExistingDoctor = await prisma.doctor.findUnique({
    where: { email: payload.doctor.email },
  });

  if (isExistingDoctor) {
    throw new Error('Doctor with this email already exists');
  }

  const doctor = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      name: payload.doctor.name,
      role: Role.DOCTOR,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const createdDoctor = await tx.doctor.create({
        data: {
          userId: doctor.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialties = specialties.map((specialty) => ({
        doctorId: createdDoctor.id,
        specialtyId: specialty.id,
      }));

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialties,
      });
      const doctorData = await tx.doctor.findUnique({
        where: { id: createdDoctor.id },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          specialization: true,
          registrationNo: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualifications: true,
          currentWorkplace: true,
          designation: true,
          averageRating: true,
          address: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });
      return doctorData;
    });

    return result;
  } catch (error) {
    console.error('Error creating doctor:', error);
    await prisma.user.delete({
      where: { id: doctor.user.id },
    });
    throw error;
  }
};

const createAdmin = async (payload: ICreateAdmin) => {
  // Step 1: Check if user already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (userExists) {
    throw new Error('User with this email already exists');
  }

  // Step 2: Create user account with Better Auth
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true,
      rememberMe: false,
    },
  });

  // Step 3: Create admin profile in transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create admin record
      const admin = await tx.admin.create({
        data: {
          userId: userData.user.id,
          name: payload.admin.name,
          email: payload.admin.email,
          profilePhoto: payload.admin.profilePhoto,
          contactNumber: payload.admin.contactNumber,
        },
      });

      // Fetch created admin with user data
      const createdAdmin = await tx.admin.findUnique({
        where: { id: admin.id },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });

      return createdAdmin;
    });

    return result;
  } catch (error) {
    // Cleanup: Delete user if admin creation fails
    await prisma.user.delete({
      where: { id: userData.user.id },
    });
    throw new Error('Failed to create admin');
  }
};

const userService = {
  createDoctor,
  createAdmin,
};

export default userService;
