import { existsSync, rmSync } from 'fs';
import { chance } from 'jest-chance';
import LockerFileManager from '../src/LockerfileManager';

describe('LockerfileManager.ts', () => {
  const tempPath = process.cwd() + '/Lockerfile';
  const masterKey = chance.string();

  if (existsSync(tempPath)) {
    rmSync(tempPath);
  }

  describe('LockerFileManager.createLockerfile()', () => {
    it('should not throw', () => {
      expect(() =>
        LockerFileManager.createLockerFile(tempPath, masterKey)
      ).not.toThrow();
    });
  });

  describe('LockerFileManager.decompressAndDecrypt()', () => {
    it('should not throw', () => {
      expect(() =>
        LockerFileManager.decompressAndDecrypt(tempPath, masterKey)
      ).not.toThrow();
    });

    it('should correctly deserialize the Lockerfile', () => {
      expect(
        LockerFileManager.decompressAndDecrypt(tempPath, masterKey)
      ).toStrictEqual({
        masterKey
      });
    });
  });

  afterAll(() => {
    rmSync(tempPath);
  });
});
