export interface UserData {
  passwordSite: string;
  username: string;
  passwordExpire: Date;
  password: string;
}

/**
 * Internal abstract `Password` class
 */
export default abstract class Password {
  public passwordSite!: string;
  public username!: string;
  public passwordExpire!: Date;
  public encryptedPassword!: string;

  /**
   *
   * @param {string} site login site
   * @param {string} user username
   * @param {number} expire when does the password expires
   * @param {string} password password
   * @param {string} key encryption key
   * @returns {void}
   */
  constructor(site: string, user: string, expire: Date, password: string) {
    this.passwordSite = site;
    this.username = user;
    this.passwordExpire = expire;
    this.encryptedPassword = password;
  }

  /**
   * @param {string} key decryption key
   * @returns {UserData}
   */
  public abstract getData(): UserData;
}
