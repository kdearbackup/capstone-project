import { TUserRole } from '../users/users.interface';

export type TSearchRequest = {
  email?: string;
  role?: TUserRole;
  firstName?: string;
  lastName?: string;
  city?: string;
  phoneNo?: string;
  jobTitle?: string;
};
