import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { CreatePersonDto } from '../../commonDto/create-person.dto';

/**
 * Physician specific information.
 */
export class CreatePhysicianDto extends CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tests?: string[];
}
