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

function shuffle(text: string | number | any) {
  const array = text.toString().split('')

  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array.join('');
}

export function suffleChar(text: string | number | any): string | number {
  let result: any 

  const IsNumber = isFinite(text)

  result = shuffle(text)
  
  if (IsNumber) {
    result = Number(result)
  }

  if (result === text) {
    return suffleChar(result)
  }

  return result


 
}
