import { Router } from 'express';

import * as ContactsController from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(ContactsController.getContactsController));

contactsRouter.get(
  '/:id',
  ctrlWrapper(ContactsController.getContactByIdController),
);

export default contactsRouter;
