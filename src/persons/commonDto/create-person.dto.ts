import { Address } from '../schemas/address.schema';
import {
  IsEmail,
  IsString,
  IsNumberString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

/**
 * Common person information.
 */
export class CreatePersonDto {
  @IsOptional()
  @IsString()
  _id?: string;

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

  @IsEmail()
  email: string;
}
