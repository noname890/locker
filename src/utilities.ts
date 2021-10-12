import * as crypto from 'crypto';
import { gzipSync, unzipSync } from 'zlib';

const AES = 'aes-256-cbc';

export interface EncryptedData {
  iv: string;
  data: string;
}

/**
 * @param {any} input
 * @param {string} key
 * @returns {EncryptedData}
 */
export function encrypt(input: any, key: string): EncryptedData {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    AES,
    hash(key, 'base64').substr(0, 32),
    iv
  );

  let encrypted = cipher.update(input);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { iv: iv.toString('hex'), data: encrypted.toString('hex') };
}

/**
 *
 * @param {EncryptedData} input
 * @param {string} key
 * @returns {unknown}
 */
export function decrypt(input: EncryptedData, key: string): string {
  const iv = Buffer.from(input.iv, 'hex');
  const encrypted = Buffer.from(input.data, 'hex');
  const decipher = crypto.createDecipheriv(
    AES,
    hash(key, 'base64').substr(0, 32),
    iv
  );
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

/**
 * Hashes a given input
 * @param {number} input Input string
 * @param {crypto.BinaryToTextEncoding} encoding
 * @returns {string}
 */
export function hash(
  input: string,
  encoding: crypto.BinaryToTextEncoding = 'hex'
): string {
  return crypto.createHash('sha256').update(input).digest(encoding);
}
/**
 * @param {string} input
 * @returns {Buffer}
 */
export function compress(input: string): Buffer {
  return gzipSync(Buffer.from(input));
}

/**
 * @param {Buffer} input
 * @returns {string}
 */
export function decompress(input: Buffer): string {
  return unzipSync(input).toString();
}
