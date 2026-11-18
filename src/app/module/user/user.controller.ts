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

const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdmin(req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const userController = {
  createDoctor,
  createAdmin,
};

export default userController;
