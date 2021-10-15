import * as OTPAuth from 'otpauth';
import Password, { UserData } from './Password';

/**
 * Time-based OTP
 */
export default class TOneTimePassword extends Password {
  /**
   * Generates an OTP given a secret
   * @param {string} secret Secret used to generate the token
   * @param {number} digits How many digits does the token have
   * @param {number} period How long does it last
   * @param {string} algorithm
   * @returns {string}
   */
  public generateTotp(
    secret: string,
    digits: number = 6,
    period: number = 30,
    algorithm: string = 'SHA1'
  ) {
    const totp = new OTPAuth.TOTP({
      secret,
      digits,
      period,
      algorithm
    });

    return totp.generate();
  }
  /**
   * Gets the password's data and generaetes the OTP
   * @returns {UserData}
   */
  public getData(): UserData {
    return {
      passwordSite: this.passwordSite,
      username: this.username,
      passwordExpire: this.passwordExpire,
      password: this.generateTotp(this.encryptedPassword)
    };
  }
}
