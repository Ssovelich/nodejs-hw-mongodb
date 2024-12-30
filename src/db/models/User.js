import { Schema, model } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hooks.js';

import { emailRegexp } from '../../constants/index.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // поле email має відповідати регулярному виразу
      match: emailRegexp,
      // вказує що email має бути унікальним
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

//після додавання сталося помилка, вона обробиться
userSchema.post('save', handleSaveError);
//перед оновленням включаємо валідацію
userSchema.pre('findOneAndUpdate', setUpdateSettings);
//підчас оновлення талося помилка, вона обробиться
userSchema.post('findOneAndUpdate', handleSaveError);

// На основі схеми створюємо модель
const UserCollection = model('user', userSchema);

export default UserCollection;
