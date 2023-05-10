import crypto from 'crypto';

const TRANSFORM_SECRET_KEY = '66eaec8f0e4ccf74d8ba0672b4700579';
const ALGORITHM = 'aes-256-ctr';
const BUFFER_ALLOC = 16;

export function decryptKey(hashText: any) {
  const message = Buffer.from(hashText, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, TRANSFORM_SECRET_KEY, Buffer.alloc(BUFFER_ALLOC));
  let decrypted = decipher.update(message);
  try {
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.log('decrypt err: ', err);
    return null;
  }
}
