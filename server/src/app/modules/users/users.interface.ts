import { Model, Types } from 'mongoose';
import { UserRole } from './users.constant';

export type TUserRole = keyof typeof UserRole;

export type TUser = {
  _id?: Types.ObjectId;
  email: string;
  role: TUserRole;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
};

export interface TUserModel extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean | null>;
  isJwtIssuedBeforePasswordChange(
    passwordChangedAtTimestamp: Date,
    jwtIssuedAtTimestamp: number,
  ): boolean;
}
