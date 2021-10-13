// i had to create another file because those tests depend on having a `Lockerfile`
// if i kept them in the other test file, those tests would run before the `LockerFileManager.createLockerFile()` test
// and would subsequently fail

import { readFileSync, rmSync } from 'fs';
import { chance } from 'jest-chance';
import LockerFileManager from '../src/LockerfileManager';

describe('LockerFileManagerInstance.ts', () => {
  const tempPath = process.cwd() + '/Lockerfile';
  const masterKey = chance.string();

  LockerFileManager.createLockerFile(tempPath, masterKey);

  describe('new LockerFileManager()', () => {
    const locker = new LockerFileManager(tempPath, masterKey);
    describe('LockerFileManager.add()', () => {
      it('should not throw', () => {
        expect(() => locker.add({ test: 'foo' })).not.toThrow();
      });
      it('should throw', () => {
        expect(() => locker.add({ test: 'foo' })).toThrow();
      });
      it('should have added test to the lockerfile', () => {
        expect(locker._getLockerFileContent().test).toBe('foo');
      });
    });
    describe('LockerFileManager.update()', () => {
      it('should not throw', () => {
        expect(() => locker.update({ test: 'bar' })).not.toThrow();
      });
      it('should throw', () => {
        expect(() => locker.update({ doesNotExist: 'bar' })).toThrow();
      });
      it('should throw if updating the master key', () => {
        expect(() => locker.update({ masterKey: 'bar' })).toThrow();
      });
      it('should have updated test', () => {
        expect(locker._getLockerFileContent().test).toBe('bar');
      });
    });
    describe('LockerFileManager.flush()', () => {
      const before = readFileSync(tempPath, 'utf-8');
      locker.flush(masterKey);
      it('should have changed the lockerfile content', () => {
        expect(readFileSync(tempPath)).not.toBe(before);
      });
    });
  });

  afterAll(() => {
    rmSync(tempPath);
  });
});
