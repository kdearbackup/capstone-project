import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { PipelineStage, Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { UserRole } from '../users/users.constant';
import { UserModel } from '../users/users.model';
import {
  DeepPartial,
  TUpdateRoleSalaryJobTitle,
  TUserDetails,
} from './userDetails.interface';
import { UserDetailsModel } from './userDetails.model';
import { TSearchRequest } from './userDetails.util';

const getMeFromDb = async (payLoad: JwtPayload) => {
  const myData = await UserModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(payLoad.id) },
    },
    {
      $lookup: {
        from: 'user-details',
        foreignField: 'userId',
        localField: '_id',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $project: {
        password: 0,
        needsPasswordChange: 0,
        _v: 0,
        passwordChangedAt: 0,
      },
    },
  ]);

  if (!myData.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Bad request, no user data found',
    );
  }

  return myData[0];
};

const updateMyProfile = async (
  user: JwtPayload,
  payLoad: DeepPartial<TUserDetails>,
) => {
  const userData = await UserModel.findById(user?.id);
  if (!userData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Unable to update, user does not exists',
    );
  }

  const updatedData = await UserDetailsModel.findOneAndUpdate(
    { userId: userData._id },
    payLoad,
    { new: true },
  );

  return updatedData;
};

const getEmployeesFromDb = async (user: JwtPayload) => {
  // const loggedInUserData = await UserModel.findById(user.id).select('role');
  const loggedInUserDetails = await UserDetailsModel.findOne({
    userId: new Types.ObjectId(user.id),
  });
  const isHR = user.role === 'hr';
  const isManager = user.role === 'manager';

  const allUsersData = await UserDetailsModel.find().populate({
    path: 'userId',
    select:
      '-needsPasswordChange -createdAt -updatedAt -__v -passwordChangedAt',
  });
  const filteredResult = allUsersData.map((doc) => {
    const userDetail = doc.toObject();
    const isSelf = user.id === userDetail?.userId?._id.toString();
    const isDirectReport =
      loggedInUserDetails?._id.toString() === userDetail?.managerId?.toString();
    const canSeeSalary = isHR || isSelf || (isManager && isDirectReport);

    if (!canSeeSalary) {
      userDetail.salary = 0;
    }

    return userDetail;
  });

  return filteredResult;
};

const updateRoleOrSalaryOrJobTitleIntoDb = async (
  id: string,
  payLoad: TUpdateRoleSalaryJobTitle,
) => {
  const userData = await UserDetailsModel.findById(id).populate(
    'userId',
    '-needsPasswordChange',
  );

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Specified user not found!');
  }

  const managerId = payLoad?.managerId;
  let managerData = null;
  if (managerId) {
    managerData = await UserDetailsModel.findById(managerId);
    if (!managerData) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'No manager data not found with specified Id!',
      );
    }
  }
  const { role, ...remaining } = payLoad;

  if (managerId && managerData) {
    remaining.managerId = managerData._id;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let updatedUser = null;
    if (role) {
      updatedUser = await UserModel.findByIdAndUpdate(
        userData?.userId?._id,
        { role },
        { new: true, runValidators: true, session },
      );
      if (!updatedUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Unable to update user!');
      }
    }

    let updatedUserDetails = null;
    if (Object.keys(remaining).length) {
      updatedUserDetails = await UserDetailsModel.findByIdAndUpdate(
        userData?._id,
        remaining,
        { new: true, runValidators: true, session },
      );

      if (!updatedUserDetails) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Unable to update user!');
      }
    }
    await session.commitTransaction();
    await session.endSession();

    return updatedUserDetails ? updatedUserDetails : updatedUser;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

const deleteAnEmployeeFromDB = async (id: string) => {
  const userData = await UserDetailsModel.findById(id).populate(
    'userId',
    '-needsPasswordChange -createdAt -updatedAt -__v',
  );

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Specified user not found!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedUser = await UserModel.findByIdAndDelete(
      userData?.userId?._id,
      { session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Unable to delete user');
    }

    const deletedUserDetails = await UserDetailsModel.findByIdAndDelete(
      userData?._id,
      { session },
    );

    if (!deletedUserDetails) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Unable to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedUserDetails;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

const getAnEmployeeFromDb = async (authUser: JwtPayload, id: string) => {
  const loggedInUserDetails = await UserDetailsModel.findOne({
    userId: new Types.ObjectId(authUser.id),
  });
  const isHR = authUser.role === 'hr';
  const isManager = authUser.role === 'manager';

  const userData = await UserDetailsModel.findById(id).populate(
    'userId',
    '-needsPasswordChange -passwordChangedAt -createdAt -updatedAt -__v',
  );

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Specified user not found!');
  }

  const userDetails = userData.toObject();
  const isSelf = authUser.id === userDetails?.userId?._id.toString();
  const isDirectReport =
    loggedInUserDetails?._id.toString() === userDetails?.managerId?.toString();
  const canSeeSalary = isHR || isSelf || (isManager && isDirectReport);

  if (!canSeeSalary) {
    userDetails.salary = 0;
  }

  return userDetails;
};

const getAllTheManagerFromDb = async () => {
  const managerData = await UserModel.aggregate([
    { $match: { role: UserRole.manager } },
    {
      $lookup: {
        from: 'user-details',
        localField: '_id',
        foreignField: 'userId',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $unset: 'userDetails.salary',
    },
    {
      $project: {
        email: 1,
        role: 1,
        userDetails: 1,
      },
    },
  ]);

  if (!managerData.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No manager data found');
  }
  return managerData;
};

const getAllHrFromDB = async () => {
  const hrData = await UserModel.aggregate([
    { $match: { role: UserRole.hr } },
    {
      $lookup: {
        from: 'user-details',
        localField: '_id',
        foreignField: 'userId',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $unset: 'userDetails.salary',
    },
    {
      $project: {
        email: 1,
        role: 1,
        userDetails: 1,
      },
    },
  ]);

  if (!hrData.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No manager data found');
  }
  return hrData;
};

const searchEmployeeFromDb = async (
  authUser: JwtPayload,
  filters: TSearchRequest,
) => {
  const { email, role, firstName, lastName, city, phoneNo, jobTitle } = filters;
  const loggedInUser = await UserDetailsModel.findOne({
    userId: new Types.ObjectId(authUser.id),
  });

  if (!loggedInUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Logged in user data not found');
  }

  const andConditions: any[] = [];

  if (email) {
    andConditions.push({ email: { $regex: email, $options: 'i' } });
  }
  if (role) {
    andConditions.push({ role });
  }

  if (firstName) {
    andConditions.push({
      'userDetails.name.firstName': { $regex: firstName, $options: 'i' },
    });
  }
  if (lastName) {
    andConditions.push({
      'userDetails.name.lastName': { $regex: lastName, $options: 'i' },
    });
  }
  if (city) {
    andConditions.push({
      'userDetails.workLocation.city': { $regex: city, $options: 'i' },
    });
  }
  if (phoneNo) {
    andConditions.push({
      'userDetails.phoneNo': { $regex: phoneNo, $options: 'i' },
    });
  }

  if (jobTitle) {
    andConditions.push({
      'userDetails.jobTitle': { $regex: jobTitle, $options: 'i' },
    });
  }
  const matchStage: Record<string, any> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Salary visibility logic
  const projectFields: any = {
    _id: 1,
    email: 1,
    role: 1,
    userDetails: {
      _id: 1,
      name: 1,
      phoneNo: 1,
      workLocation: 1,
      jobTitle: 1,
      managerId: 1,
    },
  };

  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'user-details',
        localField: '_id',
        foreignField: 'userId',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    { $match: matchStage },
  ];

  if (authUser.role === 'hr') {
    // HR can see salary for all users
    projectFields.userDetails.salary = 1;
    pipeline.push({ $project: projectFields });
  } else {
    // Employee and Manager: conditionally show salary only for allowed users
    pipeline.push({
      $addFields: {
        'userDetails.salary': {
          $cond: [
            {
              $or: [
                // Always show own salary
                {
                  $eq: ['$_id', new Types.ObjectId(authUser.id)],
                },
                // If manager, show salary for direct reports
                ...(authUser.role === 'manager'
                  ? [
                      {
                        $eq: [
                          '$userDetails.managerId',
                          new Types.ObjectId(loggedInUser._id),
                        ],
                      },
                    ]
                  : []),
              ],
            },
            '$userDetails.salary', // Show salary
            null, // Otherwise hide salary
          ],
        },
      },
    });
    projectFields.userDetails.salary = 1;
    pipeline.push({ $project: projectFields });
  }

  const result = await UserModel.aggregate(pipeline);

  return result;
};

const getAllEmployeesUnderLoggedInManagerFromDb = async (
  authUser: JwtPayload,
) => {
  const loggedInManagerDetails = await UserDetailsModel.findOne({
    userId: new Types.ObjectId(authUser.id),
  });

  if (!loggedInManagerDetails) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Unable to find manager details',
    );
  }

  const result = await UserDetailsModel.find({
    managerId: loggedInManagerDetails._id,
  }).populate({
    path: 'userId',
    select: '-needsPasswordChange -passwordChangedAt -createdAt -updatedAt',
  });

  return result;
};

export const userDetailsService = {
  getMeFromDb,
  updateMyProfile,
  getEmployeesFromDb,
  updateRoleOrSalaryOrJobTitleIntoDb,
  deleteAnEmployeeFromDB,
  getAnEmployeeFromDb,
  getAllTheManagerFromDb,
  getAllHrFromDB,
  searchEmployeeFromDb,
  getAllEmployeesUnderLoggedInManagerFromDb,
};
