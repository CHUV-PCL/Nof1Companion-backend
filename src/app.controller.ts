import { Controller, Get, Param, Req } from '@nestjs/common';
import { Public } from './utils/customDecorators/publicEndpoint';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Request } from 'express';

/**
 * Controller managing common app related features.
 */
@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Retrieves a randomly generated captcha.
   * @param req Http request object.
   * @returns An object { captchaImg: string; } containing the captcha
   * svg representation as string.
   */
  @Public()
  @Get('captcha')
  captcha(@Req() req: Request): { captchaImg: string } {
    return this.appService.generateCaptcha(req);
  }

  /**
   * Verifies the user's input against the generated captcha.
   * @param req Http request object.
   * @param captcha User input for the captcha.
   * @returns An object { verified: boolean } indicating if the user's
   * input is valid or not.
   */
  @Public()
  @Get('captcha/verify/:captcha')
  verifyCaptcha(
    @Req() req: Request,
    @Param('captcha') captcha: string,
  ): { verified: boolean } {
    return this.appService.verifyCaptcha(req, captcha);
  }
}
