/* eslint-env mocha */

import { decrypt, encrypt } from '../src/utilities';
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
});
