import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Person } from '../../schemas/person.schema';
import { encrypt, decrypt } from '../../../utils/cipher';
import mongooseLeanGetters from 'mongoose-lean-getters';

type PatientDoc = Patient & Document;

/**
 * Schema representing a patient.
 */
@Schema({
  versionKey: false,
  // Enable to use getters on almost all queries:
  toObject: { getters: true },
  toJSON: { getters: true },
})
class Patient extends Person {
  @Prop({ required: true, set: encrypt, get: decrypt })
  birthYear: string;

  @Prop({ required: true, set: encrypt, get: decrypt })
  insurance: string;

  @Prop({ required: true, set: encrypt, get: decrypt })
  insuranceNb: string;
}

const PatientSchema = SchemaFactory.createForClass(Patient);

PatientSchema.plugin(mongooseLeanGetters);

export { PatientSchema, Patient, PatientDoc };
