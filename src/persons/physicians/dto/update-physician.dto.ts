import { PartialType } from '@nestjs/mapped-types';
import { CreatePhysicianDto } from './create-physician.dto';

export class UpdatePhysicianDto extends PartialType(CreatePhysicianDto) {}
