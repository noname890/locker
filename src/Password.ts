import { decrypt, encrypt, EncryptedData } from './utilities';

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
   * @returns {void}
   */
  public set(
    site: string,
    user: string,
    expire: number,
    password: string,
    key: string
  ) {
    this.passwordSite = encrypt(site, key);
    this.username = encrypt(user, key);
    this.passwordExpire = expire;
    this.encryptedPassword = encrypt(password, key);
  }

  /**
   * @param {string} key decryption key
   * @returns {UserData}
   */
  public decrypt(key: string): UserData {
    return {
      passwordSite: decrypt(this.passwordSite, key),
      username: decrypt(this.username, key),
      passwordExpire: this.passwordExpire,
      password: decrypt(this.encryptedPassword, key)
    };
  }
}
