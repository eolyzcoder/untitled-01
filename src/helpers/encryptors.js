import crypto from 'crypto'

export const encrypt = (string, algorithm, key, iv) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  return Buffer.from(cipher.update(string, 'utf-8', 'hex') + cipher.final('hex')).toString('base64')
}

export const decrypt = (cipher, algorithm, key, iv) => {
  if (cipher !== undefined) {
    const cipherBuffer = Buffer.from(cipher, 'base64')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    console.log(decipher.update(cipherBuffer.toString('utf-8'), 'hex', 'utf-8') + decipher.final('utf-8'));
    return decipher.update(cipherBuffer.toString('utf-8'), 'hex', 'utf-8') + decipher.final('utf-8')
  }
  return cipher;
}
