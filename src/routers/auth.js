import { Router } from 'express';

import * as authController from '../controllers/auth.js';
import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authLoginSchema, authRegisterSchema, requestResetEmailSchema, resetPasswordSchema, googleOAuthSchema  } from '../validation/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(authController.registerController),
);

authRouter.get('/get-oauth-url', ctrlWrapper(authController.getGoogleOAuthUrlController));

authRouter.post(
  '/confirm-oauth',
  validateBody(googleOAuthSchema),
  ctrlWrapper(authController.loginWithGoogleController),
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

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authController.requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);


export default authRouter;
