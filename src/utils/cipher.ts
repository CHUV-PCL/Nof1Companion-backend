import {
  BinaryLike,
  createCipheriv,
  createDecipheriv,
  scryptSync,
  randomBytes,
} from 'crypto';
import { Buffer } from 'node:buffer';
import * as dotenv from 'dotenv';
dotenv.config();

// encryption parameters
const secret = process.env.SECRET;
const algorithm = 'aes-256-gcm';
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;
const tagPosition = saltLength + ivLength;
const encryptedPosition = tagPosition + tagLength;
const keylen = 32;
const scryptCost = 8192; // higher values cause too much slowdowns

/**
 * Generates a password-based derived key for further encryption.
 * @param salt Salt used for derivation.
 * @returns The derived key is returned as a Buffer, otherwise an exception is thrown.
 */
const getKey = (salt: BinaryLike) => {
  return scryptSync(secret, salt, keylen, { cost: scryptCost });
};

/**
 * Encrypts a value using a derived key, the <algorithm> algorithm and the given
 * encryption parameters.
 * @param salt Random salt.
 * @param iv Initialization vector.
 * @param value Value to encrypt.
 * @returns The encrypted value as a hex string.
 */
function _encrypt(salt: Buffer, iv: Buffer, value: string) {
  const key = getKey(salt);

  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(value), 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
}

/**
 * Encrypts a value using a derived key, the <algorithm> encryption algorithm,
 * a random initialization vector (iv) and a random salt.
 * @param value Value to encrypt.
 * @returns The encrypted value as a hex string.
 */
export const encrypt = (value: string) => {
  if (value === '' || value == null) {
    return value;
  }

  const iv = randomBytes(ivLength); // initialization vector
  const salt = randomBytes(saltLength);

  return _encrypt(salt, iv, value);
};

/**
 * Decrypts a value using a derived key and the <algorithm> encryption algorithm.
 * The random iv and salt used to encrypt the value are retrieved from the
 * encrypted value.
 * @param value Value to decrypt.
 * @returns The decrypted value as a utf8 string.
 */
export const decrypt = (value: string) => {
  if (value === '' || value == null) {
    return value;
  }

  const stringValue = Buffer.from(String(value), 'hex');

  const salt = stringValue.slice(0, saltLength);
  const iv = stringValue.slice(saltLength, tagPosition);
  const tag = stringValue.slice(tagPosition, encryptedPosition);
  const encrypted = stringValue.slice(encryptedPosition);

  const key = getKey(salt);

  const decipher = createDecipheriv(algorithm, key, iv);

  decipher.setAuthTag(tag);

  return decipher.update(encrypted) + decipher.final('utf8');
};

/**
 * Encrypts a string using a derived key, the <algorithm> encryption algorithm,
 * a constant initialization vector (iv) and a constant salt.
 * This method is designed to encrypt data fields that needs to be search for in
 * the database. Hence, the encryption output must not be idempotent and thus, the
 * salt and iv are chosen to be constant secrets.
 * In this case, it is used to encrypt email fields which are used to find
 * other documents in the database.
 * This method is less secure than the encrypt method, but it still
 * provides a decent protection.
 * @param value Value to encrypt.
 * @returns The encrypted value as a hex string.
 */
export const encryptMail = (value: string) => {
  if (value === '' || value == null) {
    return value;
  }

  const iv = Buffer.from(process.env.IV_SECRET, 'utf8');
  const salt = Buffer.from(process.env.SALT_SECRET, 'utf8');

  return _encrypt(salt, iv, value);
};
