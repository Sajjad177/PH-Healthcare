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
