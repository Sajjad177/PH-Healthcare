import z from 'zod';
import { gender } from '../../../generated/prisma/enums';

const createDoctorZodSchema = z.object({
  body: z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),

    doctor: z
      .object({
        name: z
          .string()
          .min(1, 'Name is required')
          .min(3, 'Name must be at least 3 characters')
          .max(30, 'Name must be at most 30 characters'),
        email: z.string().email('Invalid email address'),
        profilePhoto: z.string().url().optional(),
        contactNumber: z.string().min(1, 'Contact number is required'),
        specialization: z.string().min(1, 'Specialization is required'),
        registrationNo: z.string().min(1, 'Registration number is required'),
        experience: z.number().int().min(0).default(0).optional(),
        gender: z.enum([gender.MALE, gender.FEMALE], ''),
        appointmentFee: z.number().min(0),
        qualifications: z.string().min(1, 'Qualifications are required'),
        currentWorkplace: z.string().min(1, 'Current workplace is required'),
        designation: z.string().min(1, 'Designation is required'),
        address: z
          .string()
          .min(1, 'Address is required')
          .max(255, 'Address must be at most 255 characters'),
      })
      .optional(),

    specialty: z
      .array(z.string().uuid('Invalid specialty ID'))
      .min(1, 'At least one specialty is required'),
  }),
});

const updateDoctorZodSchema = z.object({
  body: z.object({
    doctor: z
      .object({
        name: z
          .string()
          .min(1, 'Name is required')
          .min(3, 'Name must be at least 3 characters')
          .max(30, 'Name must be at most 30 characters')
          .optional(),
        profilePhoto: z.string().url().optional(),
        contactNumber: z.string().min(1, 'Contact number is required').optional(),
        specialization: z.string().min(1, 'Specialization is required').optional(),
        registrationNo: z.string().min(1, 'Registration number is required').optional(),
        experience: z.number().int().min(0).default(0).optional(),
        gender: z.enum([gender.MALE, gender.FEMALE], '').optional(),
        appointmentFee: z.number().min(0).optional(),
        qualifications: z.string().min(1, 'Qualifications are required').optional(),
        currentWorkplace: z.string().min(1, 'Current workplace is required').optional(),
        designation: z.string().min(1, 'Designation is required').optional(),
        address: z
          .string()
          .min(1, 'Address is required')
          .max(255, 'Address must be at most 255 characters')
          .optional(),
      })
      .optional(),

    specialty: z
      .array(z.string().uuid('Invalid specialty ID'))
      .min(1, 'At least one specialty is required')
      .optional(),
  }),
});

const validationSchemas = {
  createDoctorZodSchema,
  updateDoctorZodSchema,
};

export default validationSchemas;
