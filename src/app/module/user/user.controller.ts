import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import doctorService from './user.service';
import status from 'http-status';

const createDoctor = catchAsync(async (req, res) => {
  const result = await doctorService.createDoctor(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Doctor created successfully',
    data: result,
  });
});

const getAllDoctors = catchAsync(async (req, res) => {});

const updateDoctor = catchAsync(async (req, res) => {});

const deleteDoctor = catchAsync(async (req, res) => {});

const doctorController = {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
};

export default doctorController;
