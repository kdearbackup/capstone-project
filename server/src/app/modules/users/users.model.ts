import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import validator from 'validator';
import config from '../../config';
import { TUser, TUserModel } from './users.interface';

const userSchema = new Schema<TUser, TUserModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      maxlength: 30,
      validate: {
        validator: (emailAdd: string) => validator.isEmail(emailAdd),
        message: '{VALUE} is not in valid email address format',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: 0,
    },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: {
        values: ['employee', 'hr', 'manager'],
        message:
          "{VALUE} is invalid. The valid role of an Employee is on of the following: 'employee', 'hr', 'manager'",
      },
      default: 'employee',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const doc = this;
  doc.password = await bcrypt.hash(
    doc.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

userSchema.statics.isUserExists = async function (id: string) {
  return await UserModel.findById(id).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJwtIssuedBeforePasswordChange = function (
  passwordChangedAtTimestamp: Date,
  jwtIssuedAtTimestamp: number,
) {
  const passwordChangedAtTime =
    new Date(passwordChangedAtTimestamp).getTime() / 1000;
  return passwordChangedAtTime > jwtIssuedAtTimestamp;
};

export const UserModel = model<TUser, TUserModel>('Users', userSchema);
