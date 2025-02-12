import { Schema, model } from 'mongoose';

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
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
  },
  { timestamps: true },
);

// На основі схеми створюємо модель(клас), який зяв'зується з колекцією "contact"
const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
