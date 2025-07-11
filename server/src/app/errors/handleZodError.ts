import httpStatus from 'http-status';
import { ZodError } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = err.issues.map((issue: any) => {
    return {
      path: String(issue?.path[issue.path.length - 1] ?? ''),
      message: issue.message,
    };
  });

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Validation Error!',
    errorSources,
  };
};

export default handleZodError;
