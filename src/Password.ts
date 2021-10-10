import { decrypt, encrypt, EncryptedData, hash } from './utilities';

export interface UserData {
  passwordSite: string;
  username: string;
  passwordExpire: number;
  password: string;
}

/**
 * Internal abstract `Password` class
 */
export default abstract class Password {
  private passwordSite!: EncryptedData;
  private username!: EncryptedData;
  private passwordExpire!: number;
  private encryptedPassword!: EncryptedData;

  /**
   *
   * @param {string} site login site
   * @param {string} user username
   * @param {number} expire when the password expires
   * @param {string} password password
   * @param {string} key encryption key
   */
  public set(
    site: string,
    user: string,
    expire: number,
    password: string,
    key: string
  ) {
    const hashedKey = hash(key);

    this.passwordSite = encrypt(site, hashedKey);
    this.username = encrypt(user, hashedKey);
    this.passwordExpire = expire;
    this.encryptedPassword = encrypt(password, hashedKey);
  }

  /**
   * @param {string} key decryption key
   * @returns {UserData}
   */
  public decrypt(key: string): UserData {
    const hashedKey = hash(key);

    return {
      passwordSite: decrypt(this.passwordSite, hashedKey),
      username: decrypt(this.username, hashedKey),
      passwordExpire: this.passwordExpire,
      password: decrypt(this.encryptedPassword, hashedKey)
    };
  }
}
