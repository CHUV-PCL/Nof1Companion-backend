import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateNof1TestDto } from './create-nof1-test.dto';

export class UpdateNof1TestDto extends PartialType(CreateNof1TestDto) {
  @IsOptional()
  @IsString()
  uid: string;
}
