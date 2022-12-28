import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../utils/customDecorators/publicEndpoint';
import { MailDto } from './dto/mail.dto';
import { PatientMailDto } from './dto/patientMail.dto';
import { PharmaMailDto } from './dto/pharmaMail.dto';
import { MailService } from './mail.service';

/**
 * Controller managing mail sending request endpoint.
 */
@ApiBearerAuth()
@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * Sends an email with the information contained in MailDto.
   * Endpoint to send an email (to a pharmacy) containing information to
   * prepare the N-of-1 treatments.
   * @param mailDto MailDto.
   * @returns An object { success: boolean, msg: string } indicating
   * email sending success or failure.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  pharmaEmail(@Body() mailDto: PharmaMailDto) {
    return this.mailService.sendPharmaEmail(mailDto);
  }

  /**
   * Sends an email with the information contained in MailDto.
   * Endpoint to send an email to a patient to provide a link
   * to the health logbook form page.
   * @param mailDto PatientMailDto.
   * @returns An object { success: boolean, msg: string } indicating
   * email sending success or failure.
   */
  @Post('/patient')
  @UsePipes(new ValidationPipe({ transform: true }))
  patientEmail(@Body() mailDto: PatientMailDto) {
    return this.mailService.sendPatientEmail(mailDto);
  }

  /**
   * Sends an email to reset the user's password.
   * @param mailDto MailDto.
   * @returns An object { success: boolean, msg: string } indicating
   * email sending success or failure.
   */
  @Public()
  @Post('/resetPwd')
  @UsePipes(new ValidationPipe({ transform: true }))
  resetPassword(@Body() mailDto: MailDto) {
    return this.mailService.sendResetPwdEmail(mailDto);
  }
}
