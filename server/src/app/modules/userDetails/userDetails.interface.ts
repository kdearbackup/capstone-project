import { Model, Types } from 'mongoose';
import { TUserRole } from '../users/users.interface';

export type TUserName = {
  firstName: string;
  lastName: string;
};

export type TWorkLocation = {
  city: string;
  state: string;
  country: string;
};

export type TUserDetails = {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: TUserName;
  phoneNo?: string;
  workLocation: TWorkLocation;
  salary: number;
  jobTitle: string;
  managerId: Types.ObjectId | null;
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<infer U> // handle arrays
      ? Array<DeepPartial<U>>
      : DeepPartial<T[P]>
    : T[P];
};

export type TUpdateRoleSalaryJobTitle = {
  salary?: Number;
  role?: TUserRole;
  jobTitle?: string;
  managerId?: Types.ObjectId | null;
};

export interface TUserDetailsModel extends Model<TUserDetails> {
  isUserDetailExists(id: string): Promise<TUserDetails | null>;
}
