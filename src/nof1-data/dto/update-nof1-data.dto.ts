import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsOptional } from 'class-validator';
import { CreateNof1DataDto } from './create-nof1-data.dto';

export class UpdateNof1DataDto extends PartialType(CreateNof1DataDto) {
  @IsOptional()
  @IsDate()
  testEndDate?: Date;
}
