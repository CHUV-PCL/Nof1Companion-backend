import { encrypt, decrypt, encryptMail } from '../src/utils/cipher';

describe('cipher - string encryption', () => {
  const str = 'Hello my little secret';
  const encrypted = encrypt(str);
  const decrypted = decrypt(encrypted);

  it('should be encrypted', () => {
    expect(encrypted).not.toEqual(str);
    expect(encrypted).not.toBe(str);
  });

  it('should be decrypted', () => {
    expect(decrypted).toEqual(str);
    expect(decrypted).toStrictEqual(str);
  });
});

describe('cipher - email encryption', () => {
  const email = 'nest@test.com';
  const encryptedMail = encryptMail(email);

  it('should be encrypted', () => {
    expect(encryptedMail).not.toEqual(email);
    expect(encryptedMail).not.toBe(email);
  });

  it('should be decrypted', () => {
    const decrypted = decrypt(encryptedMail);
    expect(decrypted).toEqual(email);
    expect(decrypted).toBe(email);
  });

  it('should not be idempotent', () => {
    let again = encryptMail(email);
    expect(encryptedMail).toEqual(again);
    expect(encryptedMail).toBe(again);
    again = encryptMail(email);
    expect(encryptedMail).toEqual(again);
    expect(encryptedMail).toBe(again);
    again = encryptMail(email);
    expect(encryptedMail).toEqual(again);
    expect(encryptedMail).toBe(again);
  });
});
