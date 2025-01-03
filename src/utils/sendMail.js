import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
// import 'dotenv/config';
// import dotenv from 'dotenv';
// dotenv.config();

import { getEnvVar } from './getEnvVar.js';


const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});
console.log(getEnvVar(SMTP.SMTP_HOST));
console.log(transporter.port);

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
