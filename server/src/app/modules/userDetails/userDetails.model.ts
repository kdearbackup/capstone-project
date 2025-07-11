import httpStatus from 'http-status';
import { model, Schema } from 'mongoose';
import AppError from '../../errors/AppError';
import { UserModel } from '../users/users.model';
import {
  TUserDetails,
  TUserDetailsModel,
  TUserName,
  TWorkLocation,
} from './userDetails.interface';

const UserNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
    minlength: [3, 'First name must have more than 3 characters'],
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    trim: true,
    minlength: [3, 'Last name must have more than 3 characters'],
    required: [true, 'Last name is required'],
  },
});

const WorkLocationSchema = new Schema<TWorkLocation>({
  city: {
    type: String,
    trim: true,
    required: [true, 'City is required'],
    minlength: [3, 'The name of the city must be at least 3 characters long'],
  },
  state: {
    type: String,
    trim: true,
    required: [true, 'State is required'],
    minlength: [2, 'The name of the state must be at least 2 characters long'],
  },
  country: {
    type: String,
    trim: true,
    required: [true, 'Country is required'],
    minlength: [
      2,
      'The name of the country must be at least 2 characters long',
    ],
  },
});

const UserDetailsSchema = new Schema<TUserDetails, TUserDetailsModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: UserModel,
    },
    name: {
      type: UserNameSchema,
      required: [true, 'Name is required'],
    },
    phoneNo: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => /^\d{10}$/.test(value),
        message:
          'Phone number can contain only numeric characters and must be 10 characters long',
      },
    },
    workLocation: {
      type: WorkLocationSchema,
      required: [true, 'Work Location is required'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required!'],
      min: [1, 'Salary has to be positive number'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required!'],
      minlength: [3, 'Job title must be at least 3 characters long'],
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'user-details',
      default: null, //Allow top-level employees (Manager of Managers) by making this not required
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

UserDetailsSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const user = await UserDetailsModel.findOne(query);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User with the provided ID does not exists!',
    );
  }
  next();
});

UserDetailsSchema.virtual('fullName').get(function () {
  return `${this.name?.firstName} ${this.name?.lastName}`;
});

UserDetailsSchema.statics.isUserDetailExists = async function (id: string) {
  return await UserDetailsModel.findById(id);
};

export const UserDetailsModel = model<TUserDetails, TUserDetailsModel>(
  'user-details',
  UserDetailsSchema,
);
