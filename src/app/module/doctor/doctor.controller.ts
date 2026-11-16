import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import doctorService from './doctor.service';
import status from 'http-status';

const getAllDoctors = catchAsync(async (req, res) => {
  const result = await doctorService.getAllDoctors();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Doctors retrieved successfully',
    data: result,
  });
});

const getDoctorById = catchAsync(async (req, res) => {
  const doctorId = req.params.id;
  const result = await doctorService.getDoctorById(doctorId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Doctor retrieved successfully',
    data: result,
  });
});

const updateDoctor = catchAsync(async (req, res) => {
  const doctorId = req.params.id;
  const updateData = req.body; // Assuming the request body contains the update data

  const result = await doctorService.updateDoctor(doctorId as string, updateData);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Doctor updated successfully',
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req, res) => {
  const doctorId = req.params.id;

  await doctorService.deleteDoctor(doctorId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Doctor deleted successfully',
  });
});

const doctorController = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};

export default doctorController;
