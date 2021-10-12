import { existsSync, readFileSync, writeFileSync } from 'fs';
import constants from './constants';
import { deserialize, serializeObj as serialize } from './serialize';
import {
  compress,
  decompress,
  decrypt,
  encrypt,
  EncryptedData
} from './utilities';

/**
 * Manages `Lockerfile`
 */
export default class LockerFileManager {
  private lockerFile: string;

  /**
   *
   * @param {string} path Path to the `Lockerfile`
   */
  constructor(public path: string) {
    this.lockerFile = readFileSync(path, 'utf-8');
  }

  /**
   * Creates a blank `Lockerfile`, does not overwrite the old one if present
   * @param {string} path where to create the `Lockerfile`
   * @param {string} masterKey masterkey to use when encrypting or decrypting the `Lockerfile`
   * @returns {void}
   */
  public static createLockerFile(path: string, masterKey: string) {
    if (existsSync(path)) throw new Error(constants.ALREADY_EXISTS);

    // used in `checkIfValid` to check if the `Lockerfile`'s masterKey and the given masterKey match
    const lockerFileInit = LockerFileManager.compressAndEncrypt(
      { masterKey },
      masterKey
    );

    writeFileSync(path, lockerFileInit);
  }

  /**
   * Utility function
   * @param {string} lockerFile the `Lockerfile` to encrypt and compress
   * @param {string} masterKey masterkey of the `Lockerfile`
   * @returns {Buffer} the encrypted and compressed `Lockerfile`
   */
  public static compressAndEncrypt(
    lockerFile: Record<string, any>,
    masterKey: string
  ) {
    if (!LockerFileManager.checkIfValid(lockerFile, masterKey)) {
      throw new Error(constants.INVALID_MASTERKEY);
    }

    return compress(serialize(encrypt(serialize(lockerFile), masterKey)));
  }

  /**
   * Utility function
   * @param {string} lockerFilePath the `Lockerfile` to decrypt and decompress
   * @param {string} masterKey masterkey of the `Lockerfile`
   * @returns {Buffer} the encrypted and compressed `Lockerfile`
   */
  public static decompressAndDecrypt(
    lockerFilePath: string,
    masterKey: string
  ) {
    const lockerFile = readFileSync(lockerFilePath);
    const decryptedLockerFile = deserialize(
      decrypt(deserialize(decompress(lockerFile)) as EncryptedData, masterKey)
    ) as Record<string, any>;

    if (!LockerFileManager.checkIfValid(decryptedLockerFile, masterKey)) {
      throw new Error(constants.INVALID_MASTERKEY);
    }

    return decryptedLockerFile;
  }

  /**
   * Checks if the given `Lockerfile` is valid.
   * @param {Record<string, any>} lockerFile
   * @param {string} masterKey
   * @returns {boolean}
   */
  public static checkIfValid(
    lockerFile: Record<string, any>,
    masterKey: string
  ) {
    return lockerFile.masterKey === masterKey;
  }
}
