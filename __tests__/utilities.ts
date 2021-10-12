/* eslint-env mocha */

import { compress, decompress, decrypt, encrypt } from '../src/utilities';
import { chance } from 'jest-chance';

describe('utilities.ts', () => {
  describe('encrypt() and decrypt()', () => {
    it('should return the input after decrypting', () => {
      const input = chance.string();
      const key = chance.string();
      const encrypted = encrypt(input, key);

      expect(decrypt(encrypted, key)).toBe(input);
    });
  });

  describe('compress()', () => {
    it('should not throw', () => {
      expect(() => compress(chance.string())).not.toThrow();
    });
  });
  describe('decompress()', () => {
    it('should not throw', () => {
      const compressed = compress(chance.string());
      expect(() => decompress(compressed)).not.toThrow();
    });
  });
  describe('compress() and decompress()', () => {
    it('should return the original string', () => {
      const input = chance.string();
      const compressed = compress(input);

      expect(decompress(compressed)).toBe(input);
    });
  });
});
