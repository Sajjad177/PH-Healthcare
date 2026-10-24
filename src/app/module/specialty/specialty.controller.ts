import { Request, Response } from 'express';
import specialtyService from './specialty.service';

const createSpecialty = async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialtyService.createSpecialty(payload);

  res.status(201).json({
    status: 'success',
    message: 'Specialty created successfully',
    data: result,
  });
};

const specialtyController = {
  createSpecialty,
};

export default specialtyController;
