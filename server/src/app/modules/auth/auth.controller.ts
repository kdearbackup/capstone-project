import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.services';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const result = await authServices.registerUser(payLoad);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User has been registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie('accessToken', accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully',
    data: {
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.changePassword(req.user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password has been updated successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const accessToken = await authServices.refreshToken(token);

  res.cookie('accessToken', accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token created successfully',
    data: '',
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const cookieOptions = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged out successfully!',
    data: '',
  });
});

export const authController = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  logoutUser,
};
