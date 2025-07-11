import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';
import httpStatus from 'http-status';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Invalid Id',
    errorSources,
  };
};

export default handleCastError;
