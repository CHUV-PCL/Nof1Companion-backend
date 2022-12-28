import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePersonDto } from '../../commonDto/create-person.dto';

/**
 * Patient specific information.
 */
export class CreatePatientDto extends CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  birthYear: string;

  @IsString()
  @IsNotEmpty()
  insurance: string;

  @IsString()
  @IsNotEmpty()
  insuranceNb: string;
}
