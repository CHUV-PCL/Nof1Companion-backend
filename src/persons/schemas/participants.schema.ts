import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Physician,
  PhysicianSchema,
} from '../physicians/schemas/physician.schema';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema';
import { Pharmacy, PharmacySchema } from './pharmacy.schema';

/**
 * Schema representing participants information.
 */
@Schema({
  versionKey: false,
  _id: false,
})
class Participants {
  @Prop({ type: PatientSchema, require: true })
  patient: Patient;

  @Prop({ type: PhysicianSchema, require: true })
  requestingPhysician: Physician;

  @Prop({ type: PhysicianSchema })
  attendingPhysician?: Physician;

  @Prop({ type: PhysicianSchema, require: true })
  nof1Physician: Physician;

  @Prop({ type: PharmacySchema, require: true })
  pharmacy: Pharmacy;
}

const ParticipantsSchema = SchemaFactory.createForClass(Participants);

export { ParticipantsSchema, Participants };
