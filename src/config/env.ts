import dotenv from 'dotenv';

const envName = process.env.ENV ?? 'demo';
dotenv.config({ path: `.env.${envName}` });

export const config = {
  envName,
  baseURL: process.env.BASE_URL ?? '[https://opensource-demo.orangehrmlive.com](https://opensource-demo.orangehrmlive.com)',
  adminUser: process.env.ADMIN_USER ?? 'Admin',
  adminPass: process.env.ADMIN_PASS ?? 'admin123',
};