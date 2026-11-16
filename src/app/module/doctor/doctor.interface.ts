import { gender } from '../../../generated/prisma/enums';

export interface IUpdateDoctor {
  doctor?: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    specialization?: string;
    registrationNo?: string;
    experience?: number;
    gender?: gender;
    appointmentFee?: number;
    qualifications?: string;
    currentWorkplace?: string;
    designation?: string;
    address?: string;
  };

  user?: {
    name?: string;
    image?: string;
  };
}
