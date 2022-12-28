import { IsEmail, IsNotEmptyObject, IsObject, IsString } from 'class-validator';

export class MailDto {
  /**
   * Message to include into the email.
   */
  @IsObject()
  @IsNotEmptyObject()
  msg: {
    text: string;
    html: string;
  };

  /**
   * Destination email.
   */
  @IsEmail()
  dest: string;

  /**
   * Email subject.
   */
  @IsString()
  subject: string;
}
