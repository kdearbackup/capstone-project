import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequests';
import { UserRole } from '../users/users.constant';
import { predictionController } from './predictSalary.controller';
import { predictSalaryValidationSchema } from './predictSalary.validation';

const router = express.Router();

router.post(
  '/salary',
  auth(UserRole.hr, UserRole.manager, UserRole.employee),
  validateRequest(predictSalaryValidationSchema),
  predictionController.predictSalary,
);

export const predictionRoute = router;
