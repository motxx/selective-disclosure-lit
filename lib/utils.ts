import { EncryptedText } from './types/encryption';

export function blobToString(b: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(b);
  });
}

export function stringToBlob(s: string): Blob {
  const byteCharacters = atob(s.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray]);
}

export async function serialize(enc: EncryptedText): Promise<string> {
  const encCopy: any = { ...enc };
  encCopy.encryptedString = await blobToString(enc.encryptedString);
  return JSON.stringify(encCopy);
}

export async function deserialize(s: string): Promise<EncryptedText> {
  const enc: any = JSON.parse(s);
  enc.encryptedString = stringToBlob(enc.encryptedString);
  return enc as EncryptedText;
}
