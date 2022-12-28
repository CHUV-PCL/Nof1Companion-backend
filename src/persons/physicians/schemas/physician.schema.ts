import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Person } from '../../schemas/person.schema';
import mongooseLeanGetters from 'mongoose-lean-getters';

type PhysicianDoc = Physician & Document;

/**
 * Schema representing a physician.
 */
@Schema({
  versionKey: false,
  // Enable to use getters on almost all queries:
  toObject: { getters: true },
  toJSON: { getters: true },
})
class Physician extends Person {
  @Prop({ required: true })
  institution: string;

  @Prop({ type: [String], required: false })
  tests: string[];
}

const PhysicianSchema = SchemaFactory.createForClass(Physician);

PhysicianSchema.plugin(mongooseLeanGetters);

export { PhysicianSchema, Physician, PhysicianDoc };
