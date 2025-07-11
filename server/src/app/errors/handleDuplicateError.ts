import httpStatus from 'http-status';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const errorSources: TErrorSources[] = [
    {
      path: '',
      message: `${extractedMessage} already exists`,
    },
  ];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate Field error',
    errorSources,
  };
};

export default handleDuplicateError;
