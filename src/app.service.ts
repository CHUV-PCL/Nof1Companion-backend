import { Injectable } from '@nestjs/common';
import svgCaptcha from 'svg-captcha-fixed';
import { Request } from 'express';

/**
 * Service managing common app related features.
 */
@Injectable()
export class AppService {
  /**
   * Generates a captcha and returns its svg representation as string.
   * @param req Request object.
   * @returns An object { captchaImg: string; } containing the captcha
   * svg representation as string.
   */
  generateCaptcha(req: Request) {
    const captcha = svgCaptcha.create({
      size: 5,
      ignoreChars: '0oO1lI',
      noise: 2,
    });
    const session = req.session;
    session['captcha'] = captcha.text;
    return { captchaImg: captcha.data };
  }

  /**
   * Verifies the user's input against the generated captcha.
   * @param req Http request object.
   * @param userCaptcha User input for the captcha.
   * @returns An object { verified: boolean } indicating if the user's
   * input is valid or not.
   */
  verifyCaptcha(req: Record<string, any>, userCaptcha: string) {
    const isVerified = req.session.captcha === userCaptcha;
    if (isVerified) {
      req.session.destroy(null);
    }
    return { verified: isVerified };
  }
}
