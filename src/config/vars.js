import * as dotenv from 'dotenv';

dotenv.config();

const vars = {
  port: process.env.PORT || '8080',
  jwtSecret: process.env.JWT_KEY,
  frontendUrl: process.env.FRONTEND_URL || '',
  database: process.env.DATABASE_URI,
  encryptKey: process.env.ENCRYPT_KEY,
  encryptAlgo: process.env.ENCRYPT_ALGO,
  encryptIV: process.env.ENCRYPT_IV,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};


export default vars;
