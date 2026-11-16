import status from 'http-status';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import userService from './user.service';

const createDoctor = catchAsync(async (req, res) => {
  const result = await userService.createDoctor(req.body);

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

const userController = {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
};

export default userController;
