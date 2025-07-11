import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequests';
import { UserRole } from '../users/users.constant';
import { userDetailsController } from './userDetails.controller';
import { userDetailsValidationSchema } from './userDetails.validation';

const router = express.Router();

router.get(
  '/me',
  auth(UserRole.hr, UserRole.manager, UserRole.employee),
  userDetailsController.getMe,
);

router.patch(
  '/update-me',
  auth(UserRole.hr, UserRole.manager, UserRole.employee),
  validateRequest(
    userDetailsValidationSchema.UpdateEmployeeDetailValidationSchema,
  ),
  userDetailsController.updateMyProfile,
);

router.patch(
  '/employee/:userId',
  auth(UserRole.hr, UserRole.manager),
  validateRequest(
    userDetailsValidationSchema.UpdateHRManagerDetailValidationSchema,
  ),
  userDetailsController.updateRoleOrSalaryOrJobTitle,
);

router.get(
  '/employees',
  auth(UserRole.hr, UserRole.manager, UserRole.employee),
  userDetailsController.getEmployees,
);

router.get(
  '/employees/:userId',
  auth(UserRole.hr, UserRole.manager, UserRole.employee),
  userDetailsController.getAnEmployee,
);

router.get(
  '/managers',
  auth(UserRole.hr, UserRole.manager),
  userDetailsController.getManagersData,
);

router.get(
  '/hrs',
  auth(UserRole.hr, UserRole.manager),
  userDetailsController.getHRsData,
);

router.post(
  '/employees/search',
  auth(UserRole.hr, UserRole.manager, UserRole.employee),
  validateRequest(userDetailsValidationSchema.searchValidationSchema),
  userDetailsController.searchEmployee,
);

router.delete(
  '/employees/:userId',
  auth(UserRole.hr, UserRole.manager),
  userDetailsController.deleteAnEmployee,
);

export const userDetailsRouter = router;
