import { prisma } from '../../lib/prisma';
import { IUpdateDoctor } from './doctor.interface';

const getAllDoctors = async () => {
  // Implementation for retrieving all doctors
  const doctorData = await prisma.doctor.findMany({
    include: {
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
};

const getDoctorById = async (doctorId: string) => {
  const doctorData = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
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
};

const updateDoctor = async (id: string, payload: IUpdateDoctor) => {
  const result = await prisma.$transaction(async (tx) => {
    const existingDoctor = await tx.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor || existingDoctor.isDeleted) {
      throw new Error('Doctor not found');
    }

    const doctorData = payload.doctor ?? {};
    const userData = payload.user ?? {};

    if (doctorData.name !== undefined) {
      userData.name = doctorData.name;
    }

    if (doctorData.profilePhoto !== undefined) {
      userData.image = doctorData.profilePhoto;
    }

    const updatedDoctor = await tx.doctor.update({
      where: { id },
      data: doctorData,
    });

    if (Object.keys(userData).length > 0) {
      await tx.user.update({
        where: { id: existingDoctor.userId },
        data: userData,
      });
    }

    return updatedDoctor;
  });

  return result;
};

const deleteDoctor = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const doctor = await tx.doctor.findUnique({
      where: { id },
    });

    if (!doctor || doctor.isDeleted) {
      throw new Error('Doctor not found');
    }

    const deletedAt = new Date();

    await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt,
      },
    });

    await tx.user.update({
      where: { id: doctor.userId },
      data: {
        isDeleted: true,
        deletedAt,
      },
    });

    return { message: 'Doctor deleted successfully' };
  });

  return result;
};

const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};

export default doctorService;
