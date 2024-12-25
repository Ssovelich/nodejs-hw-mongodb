import { refreshTokenLifetime } from '../constants/index.js';
import * as authServices from '../services/auth.js';

export const registerController = async (req, res) => {
  const user = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered user',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: Date.now() + refreshTokenLifetime,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: Date.now() + refreshTokenLifetime,
  });
  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
