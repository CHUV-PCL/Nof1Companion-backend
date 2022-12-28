import { IsEmail } from 'class-validator';

/**
 * User required information for update.
 */
export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsEmail()
  newEmail: string;
}
