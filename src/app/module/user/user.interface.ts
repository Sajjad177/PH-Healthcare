import { gender } from '../../../generated/prisma/enums';

export interface ICreateDoctor {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
    specialization: string;
    registrationNo: string;
    experience?: number;
    gender: gender;
    appointmentFee: number;
    qualifications: string;
    currentWorkplace: string;
    designation: string;
    averageRating?: number;
    address: string;
  };
  specialty: string[];
}

// Add this interface to user.interface.ts

export interface ICreateAdmin {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
  };
}
