import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequests';
import { userDetailsValidationSchema } from '../userDetails/userDetails.validation';
import { UserRole } from '../users/users.constant';
import { authController } from './auth.controller';
import { authValidations } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  auth(UserRole.hr, UserRole.manager),
  validateRequest(userDetailsValidationSchema.createUserValidationSchema),
  authController.registerUser,
);

router.post(
  '/login',
  validateRequest(authValidations.loginUserValidationSchema),
  authController.loginUser,
);

router.post(
  '/logout',
  auth(UserRole.hr, UserRole.manager, UserRole.employee),
  authController.logoutUser,
);

router.post(
  '/change-password',
  auth(UserRole.employee, UserRole.hr, UserRole.manager),
  validateRequest(authValidations.changePasswordValidationSchema),
  authController.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(authValidations.refreshTokenValidationSchema),
  authController.refreshToken,
);
export const authRouter = router;
