import * as authServices from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

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

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  //коли приходить запит на logout
  if (req.cookies.sessionId) {
    // видаляємо сесію
    await authServices.logout(req.cookies.sessionId);
  }

  //видаляємо cookies
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  // відправляємо відповідь
  res.status(204).send();
};

export const refreshSessionController = async (req, res) => {
  const session = await authServices.refreshSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
