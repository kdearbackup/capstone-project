import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import z from 'zod';
import config from '../../config';
import AppError from '../../errors/AppError';
import { TUserDetails } from '../userDetails/userDetails.interface';
import { UserDetailsModel } from '../userDetails/userDetails.model';
import { userDetailsValidationSchema } from '../userDetails/userDetails.validation';
import { UserRole } from '../users/users.constant';
import { UserModel } from '../users/users.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';

export type TUserPayload = z.infer<
  typeof userDetailsValidationSchema.createUserValidationSchema.shape.body
>;

const registerUser = async (payLoad: TUserPayload) => {
  const managerId = payLoad?.managerId;
  let manager = null;
  if (managerId) {
    manager = await UserDetailsModel.findById(managerId);
    if (!manager) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Specified manager does not exist in the database',
      );
    }
  }
  const { email, password, role, ...remaining } = payLoad;
  const userData = {
    email: email,
    password: password,
    role: role ?? UserRole.employee,
  };

  remaining.salary = Number(remaining.salary);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await UserModel.create([userData], { session });
    if (!user.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    const userDetailsData: TUserDetails = {
      ...remaining,
      userId: user[0]._id,
      managerId: manager ? manager._id : null,
    };

    const newUserDetailsData = await UserDetailsModel.create(
      [userDetailsData],
      { session },
    );

    if (!newUserDetailsData.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    await session.commitTransaction();
    await session.endSession();

    return newUserDetailsData[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(
      typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : JSON.stringify(error),
    );
  }
};

const loginUser = async (payLoad: TLoginUser) => {
  const user = await UserModel.findOne({ email: payLoad.email }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified user does not exist in the database',
    );
  }

  if (!(await UserModel.isPasswordMatched(payLoad?.password, user?.password))) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Incorrect Password, please provide the right password.',
    );
  }

  const jwtPayLoad = {
    id: user._id.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayLoad,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayLoad,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    data: {
      ...jwtPayLoad,
      needsPasswordChange: user.needsPasswordChange,
    },
  };
};

const changePassword = async (
  userData: JwtPayload,
  payLoad: { oldPassword: string; newPassword: string },
) => {
  const user = await UserModel.isUserExists(userData?.id);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified user does not exist in the database',
    );
  }

  if (
    !(await UserModel.isPasswordMatched(payLoad?.oldPassword, user?.password))
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Incorrect Old Password, please provide the right password.',
    );
  }

  const newHashedPassword = await bcrypt.hash(
    payLoad?.newPassword,
    Number(config.bcrypt_salt_round),
  );

  const result = await UserModel.findOneAndUpdate(
    { _id: userData?.id, role: userData?.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    {
      runValidators: true,
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  const { id, iat } = decoded;

  const user = await UserModel.isUserExists(id);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified user does not exist in the database',
    );
  }

  if (
    user.passwordChangedAt &&
    UserModel.isJwtIssuedBeforePasswordChange(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Unauthorized user: Need to log back in',
    );
  }

  const jwtPayload = {
    id: user._id!.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return { accessToken };
};

export const authServices = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
};
