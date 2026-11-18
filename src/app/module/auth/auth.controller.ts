import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { tokenUtils } from '../../utils/token';
import authService from './auth.service';

const registerPatient = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.registerPatient(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBatterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Patient registered successfully',
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBatterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const authController = {
  registerPatient,
  loginUser,
};

export default authController;
