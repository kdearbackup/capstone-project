import jwt, { SignOptions } from 'jsonwebtoken';
import { TUserRole } from '../users/users.interface';

export const createToken = (
  jwtPayload: { id: string; role: TUserRole },
  secretKey: string,
  expiresIn: string,
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(jwtPayload, secretKey, options);
};
