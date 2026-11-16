import { Role, Specialty } from '../../../generated/prisma/client';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { ICreateDoctor } from './user.interface';

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

const getAllDoctors = async () => {
  // Implementation for retrieving all doctors
};

const updateDoctor = async () => {
  // Implementation for updating a doctor
};

const deleteDoctor = async () => {
  // Implementation for deleting a doctor
};

const doctorService = {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
};

export default doctorService;
