import { Address } from '../../persons/schemas/address.schema';
import {
  IsEmail,
  IsString,
  IsNumberString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';

/**
 * User information for registration.
 */
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  @ValidateNested()
  address: Address;

  @IsNumberString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsOptional()
  tests: string[] = [];
}
