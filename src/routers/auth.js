import { Router } from 'express';

import * as authController from '../controllers/auth.js';
import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authLoginSchema, authRegisterSchema } from '../validation/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(authController.registerController),
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(authController.loginController),
);

authRouter.post('/logout', ctrlWrapper(authController.logoutController));

authRouter.post(
  '/refresh',
  ctrlWrapper(authController.refreshSessionController),
);

export default authRouter;
