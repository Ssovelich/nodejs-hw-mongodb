import { Router } from 'express';

import * as authController from '../controllers/auth.js';
import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authRegisterSchema } from '../validation/auth.js';

import(authRegisterSchema);

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(authController.registerController),
);

export default authRouter;
