import * as authServices from '../services/auth.js';

export const registerController = async (req, res) => {
  const data = await authServices.register(req.body);
};
