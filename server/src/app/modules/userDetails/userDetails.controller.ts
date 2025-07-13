import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TUpdateRoleSalaryJobTitle } from './userDetails.interface';
import { userDetailsService } from './userDetails.services';

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payLoad = req.user;
    const result = await userDetailsService.getMeFromDb(payLoad);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User data retrieved successfully',
      data: result,
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const payLoad = req.body;
    const result = await userDetailsService.updateMyProfile(user, payLoad);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Profile updated successfully',
      data: result,
    });
  },
);

const getEmployees = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await userDetailsService.getEmployeesFromDb(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All employees data retrieved successfully',
      data: result,
    });
  },
);

const updateRoleOrSalaryOrJobTitle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payLoad = req.body as TUpdateRoleSalaryJobTitle;
    const id = req.params.userId;
    const result = await userDetailsService.updateRoleOrSalaryOrJobTitleIntoDb(
      id,
      payLoad,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Employee data updated successfully',
      data: result,
    });
  },
);

const deleteAnEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId;
    const result = await userDetailsService.deleteAnEmployeeFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Employee deleted successfully',
      data: result,
    });
  },
);

const getAnEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId;
    const authUser = req.user;
    const result = await userDetailsService.getAnEmployeeFromDb(authUser, id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Employee datails retrieved successfully',
      data: result,
    });
  },
);

const getManagersData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userDetailsService.getAllTheManagerFromDb();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Managers data retrieved successfully',
      data: result,
    });
  },
);

const getHRsData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userDetailsService.getAllHrFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'HRs data retrieved successfully',
      data: result,
    });
  },
);

const searchEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filter = req.body;
    const authUser = req.user;
    const result = await userDetailsService.searchEmployeeFromDb(
      authUser,
      filter,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Employee data retrieved successfully',
      data: result,
    });
  },
);

const getAllEmployeesUndarLoggedInManager = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = req.user;
    const result =
      await userDetailsService.getAllEmployeesUnderLoggedInManagerFromDb(
        authUser,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All employees reporting to you have been successfully fetched.',
      data: result,
    });
  },
);

export const userDetailsController = {
  getMe,
  updateMyProfile,
  getEmployees,
  updateRoleOrSalaryOrJobTitle,
  deleteAnEmployee,
  getAnEmployee,
  getManagersData,
  getHRsData,
  searchEmployee,
  getAllEmployeesUndarLoggedInManager,
};
