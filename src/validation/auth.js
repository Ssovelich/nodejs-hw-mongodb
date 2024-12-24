import Joi from 'joi';

import { emailRegexp } from '../constants/index.js';

export const authRegisterSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
