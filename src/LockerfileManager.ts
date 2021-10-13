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
  private lockerFile!: Record<string, any>;

  /**
   *
   * @param {string} path Path to the `Lockerfile`
   * @param {string} masterKey
   */
  constructor(public path: string, masterKey: string) {
    this.open(masterKey);
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
   * @param {string} lockerFile the `Lockerfile` to decrypt and decompress
   * @param {string} masterKey masterkey of the `Lockerfile`
   * @returns {Buffer} the encrypted and compressed `Lockerfile`
   */
  public static decompressAndDecrypt(lockerFile: Buffer, masterKey: string) {
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

  /**
   * Opens the `Lockerfile`, throws an `Error` if the `Lockerfile` does not exist.
   * @param {string} masterKey
   * @returns {void}
   */
  public open(masterKey: string) {
    if (!existsSync(this.path)) throw new Error(constants.NO_LOCKERFILE_FOUND);
    this.lockerFile = LockerFileManager.decompressAndDecrypt(
      readFileSync(this.path),
      masterKey
    );
  }

  /**
   * Adds entries into the `Lockerfile`, but does not overwrite them.
   * @param {Record<string, any>} obj
   * @returns {void}
   */
  public add(obj: Record<string, any>) {
    for (const i in obj) {
      if (this.lockerFile[i]) {
        throw new Error(constants.NO_OVEWRITE(i));
      }
      this.lockerFile[i] = obj[i];
    }
  }

  /**
   * Updates the `Lockerfile`'s entries, but does not create them.
   * Does not update the Master Key
   * @param {Record<string, any>} obj
   * @returns {void}
   */
  public update(obj: Record<string, any>) {
    for (const i in obj) {
      if (i === 'masterKey') throw new Error(constants.NO_OVERWRITE_MASTERKEY);
      if (!this.lockerFile[i]) {
        throw new Error(constants.FIELD_DOES_NOT_EXIST(i));
      }
      this.lockerFile[i] = obj[i];
    }
  }

  /**
   * Writes the changes to the `Lockerfile`
   * @param {string} masterKey
   * @returns {void}
   */
  public flush(masterKey: string) {
    writeFileSync(
      this.path,
      LockerFileManager.compressAndEncrypt(this.lockerFile, masterKey)
    );
  }

  /**
   * Returns the current `Lockerfile`'s content. Used for testing.
   * @api private
   * @returns {Record<string, any>}
   */
  public _getLockerFileContent() {
    return this.lockerFile;
  }
}
