import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanGetters from 'mongoose-lean-getters';
import {
  AdministrationSchema,
  AnalyseType,
  ClinicalInfo,
  RandomizationStrategy,
  Substance,
  SubstancePosologies,
  Variable,
} from '../@types/types';
import { TestStatus } from '../../utils/constants';
import {
  Participants,
  ParticipantsSchema,
} from '../../persons/schemas/participants.schema';

type Nof1TestDoc = Nof1Test & Document;

/**
 * Schema representing the N-of-1 test information.
 */
@Schema({
  versionKey: false,
  // Enable to use getters on almost all queries:
  toObject: { getters: true },
  toJSON: { getters: true },
})
class Nof1Test {
  @Prop()
  uid: string;

  @Prop({ type: ParticipantsSchema, required: true })
  participants: Participants;

  @Prop({ type: Object })
  clinicalInfo: ClinicalInfo;

  @Prop({ type: String, required: true, enum: Object.values(TestStatus) })
  status: TestStatus;

  @Prop({ required: true })
  nbPeriods: number;

  @Prop({ required: true })
  periodLen: number;

  @Prop({ type: Object, required: true })
  statistics: { analysisToPerform: AnalyseType };

  @Prop({ type: Object, required: true })
  randomization: RandomizationStrategy;

  @Prop()
  beginningDate: Date;

  @Prop()
  endingDate: Date;

  @Prop({ type: [String] })
  substancesSequence: string[];

  @Prop({ type: [Object] })
  administrationSchema: AdministrationSchema[];

  @Prop({ type: [Object], required: true })
  substances: Substance[];

  @Prop({ type: [Object], required: true })
  posologies: SubstancePosologies[];

  @Prop({ type: [Object], required: true })
  monitoredVariables: Variable[];

  @Prop({ type: Object })
  meta_info: {
    creationDate: Date;
    emailSendingDate?: Date;
    showPeriodQuestions: boolean;
  };
}

const Nof1TestSchema = SchemaFactory.createForClass(Nof1Test);

Nof1TestSchema.plugin(mongooseLeanGetters);

export { Nof1TestSchema, Nof1Test, Nof1TestDoc };
