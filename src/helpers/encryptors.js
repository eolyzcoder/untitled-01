import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const algorithm = process.env.DB_ENCRYPT_ALG;
const key = process.env.DB_ENCRYPT_KEY;
const iv = process.env.DB_ENCRYPT_IV;

export const encrypt = (string) => {
  if (!string || !algorithm || !key || !iv) {
    throw new Error('Missing required argument for encryption');
  }

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return Buffer.from(cipher.update(string, 'utf-8', 'hex') + cipher.final('hex')).toString('base64');
};

export const decrypt = (cipher) => {
  if (!cipher || !algorithm || !key || !iv) {
    throw new Error('Missing required argument for decryption');
  }

  if (cipher !== undefined) {
    try {
      const cipherBuffer = Buffer.from(cipher, 'base64');
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      const decryptedString = decipher.update(cipherBuffer.toString('utf-8'), 'hex', 'utf-8') + decipher.final('utf-8');
      console.log(decryptedString);
      return decryptedString;
    } catch (error) {
      console.error('Decryption failed:', error.message);
      return null;
    }
  }
  return null;
};
