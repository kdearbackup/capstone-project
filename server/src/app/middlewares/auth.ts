import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/users/users.interface';
import catchAsync from '../utils/catchAsync';
import { UserModel } from './../modules/users/users.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized user');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { id, role, iat } = decoded;

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

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized user');
    }

    req.user = decoded;
    next();
  });
};

export default auth;
