import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { xlsx } from '../utils/xlsxGenerator';
import { MailDto } from './dto/mail.dto';
import { PatientMailDto } from './dto/patientMail.dto';
import { PharmaMailDto } from './dto/pharmaMail.dto';

/**
 * Service managing email sending.
 */
@Injectable()
export class MailService {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly from: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    this.transporter = createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: 587,
      secure: false, // will be upgraded with STARTTLS
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
    this.from = `N-of-1 Service <${this.configService.get<string>(
      'MAIL_USER',
    )}>`;
  }

  /**
   * Sends an email with the information contained in MailDto.
   * Converts the N-of-1 test preparation data to XLSX format and
   * attaches it to the email.
   * @param mailDto MailDto.
   * @returns An object { success: boolean, msg: string } indicating
   * email sending success or failure.
   */
  async sendPharmaEmail(mailDto: PharmaMailDto) {
    const { filename, xlsbuf } = await xlsx(mailDto.data);

    return this.transporter
      .sendMail({
        from: this.from,
        to: mailDto.dest,
        subject: mailDto.subject,
        text: mailDto.msg.text, // plain text body
        html: mailDto.msg.html, // html body
        attachments: [
          {
            filename,
            content: xlsbuf,
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        ],
      })
      .then(() => {
        return { success: true, msg: 'Email sent' };
      })
      .catch(() => {
        return { success: false, msg: 'An error occurred, email was not send' };
      });
  }

  /**
   * Sends an email to a patient to provide a link to the health logbook form page.
   * Attaches a token to the link to allow further API requests.
   * @param mailDto PatientMailDto.
   * @returns An object { success: boolean, msg: string } indicating
   * email sending success or failure.
   */
  async sendPatientEmail(mailDto: PatientMailDto) {
    const token = this.jwtService.sign({
      dest: mailDto.dest,
      exp: mailDto.tokenExp,
      nbf: mailDto.notBefore,
    });
    const txtMsg = mailDto.msg.text.replace('TOKEN', token);
    const htmlMsg = mailDto.msg.html.replace('TOKEN', token);

    return this.transporter
      .sendMail({
        from: this.from,
        to: mailDto.dest,
        subject: mailDto.subject,
        text: txtMsg, // plain text body
        html: htmlMsg, // html body
      })
      .then(() => {
        return { success: true, msg: 'Email sent' };
      })
      .catch(() => {
        return { success: false, msg: 'An error occurred, email was not send' };
      });
  }

  /**
   * Sends an email to a user to provide a link to the reset password page.
   * Attaches a token to the link to allow further API requests.
   * @param mailDto MailDto.
   * @returns An object { success: boolean, msg: string } indicating
   * email sending success or failure.
   */
  async sendResetPwdEmail(mailDto: MailDto) {
    const token = this.jwtService.sign({
      dest: mailDto.dest,
      exp: Math.floor(Date.now() / 1000) + 60 * 20, // 20 min
    });
    const user = await this.usersService.findByEmail(mailDto.dest);
    const id = user._id.toString();
    const txtMsg = mailDto.msg.text.replace('TOKEN', token).replace('ID', id);
    const htmlMsg = mailDto.msg.html.replace('TOKEN', token).replace('ID', id);

    return this.transporter
      .sendMail({
        from: this.from,
        to: mailDto.dest,
        subject: mailDto.subject,
        text: txtMsg, // plain text body
        html: htmlMsg, // html body
      })
      .then(() => {
        return { success: true, msg: 'Email sent' };
      })
      .catch(() => {
        return { success: false, msg: 'An error occurred, email was not send' };
      });
  }
}
