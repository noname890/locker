import Password, { UserData } from './Password';

/**
 * Class used for simple text based passwords
 */
export default class SimplePassword extends Password {
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
    super(site, user, expire, password);
  }

  /**
   * Gets the password's data
   * @returns {UserData}
   */
  public getData(): UserData {
    return {
      passwordSite: this.passwordSite,
      username: this.username,
      passwordExpire: this.passwordExpire,
      password: this.encryptedPassword
    };
  }
}
