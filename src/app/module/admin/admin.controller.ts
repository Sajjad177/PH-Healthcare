import status from 'http-status';
import catchAsync from '../../shared/catchAsync';
import adminService from './admin.service';

const getAllAdmin = catchAsync(async (req, res) => {
  const result = await adminService.getAllAdmin();

  res.status(status.OK).json({
    success: true,
    message: 'Admins retrieved successfully',
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.getSingleAdmin(id as string);

  res.status(status.OK).json({
    success: true,
    message: 'Admin retrieved successfully',
    data: result,
  });
});

const adminController = {
  getAllAdmin,
  getSingleAdmin,
};

export default adminController;
