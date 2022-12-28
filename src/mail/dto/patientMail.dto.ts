import { IsInt, IsNotEmpty } from 'class-validator';
import { MailDto } from './mail.dto';

export class PatientMailDto extends MailDto {
  /**
   * Expiration date of the token for the patient's url.
   * Protect API routes and forbid access after expiration.
   */
  @IsInt()
  @IsNotEmpty()
  tokenExp: number;

  /**
   * Identifies the date before which the JWT must not be accepted for processing.
   * Protect API routes and forbid access before the right date.
   */
  @IsInt()
  @IsNotEmpty()
  notBefore: number;
}
