import { Schema, model } from 'mongoose';

import { typeList } from '../../constants/contacts.js';
import { setUpdateSettinds } from '../hooks.js';
// Створюємо mongo схему
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      default: 'personal',
      required: true,
    },
  },
  // versionKey: false прибирає додавання версії обєкту
  // timestamps: true додає дату та час створення та оновлення
  { versionKey: false, timestamps: true },
);

//перед оновленням встанови
contactSchema.pre('findOneAndUpdate', setUpdateSettinds);

// На основі схеми створюємо модель(клас), який зяв'зується з колекцією "contact"
const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
