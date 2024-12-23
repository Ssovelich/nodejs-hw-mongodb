import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  // перевіряє чи є валідним переданий di
  if (!isValidObjectId(id)) {
    throw createHttpError(400, `The contact ID: ${id} is not a valid object`);
  }

  next();
};
