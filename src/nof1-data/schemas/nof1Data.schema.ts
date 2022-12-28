import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TestData } from '../dto/create-nof1-data.dto';

export type Nof1DataDoc = Nof1Data & Document;

/**
 * Schema representing the health variables data of a N-of-1 test.
 */
@Schema()
export class Nof1Data {
  @Prop({ required: true })
  testId: string;

  @Prop({ type: [Object], required: true })
  data: TestData;
}

export const Nof1DataSchema = SchemaFactory.createForClass(Nof1Data);
