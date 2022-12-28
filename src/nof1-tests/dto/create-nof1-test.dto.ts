import {
  AdministrationSchema,
  AnalyseType,
  ClinicalInfo,
  RandomizationStrategy,
  Substance,
  SubstancePosologies,
  Variable,
} from '../@types/types';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDate,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
  IsString,
} from 'class-validator';
import { TestStatus } from '../../utils/constants';
import { Participants } from '../../persons/schemas/participants.schema';

/**
 * Representation of the N-of-1 test information.
 */
export class CreateNof1TestDto {
  @IsObject()
  @ValidateNested()
  participants: Participants;

  @IsObject()
  @ValidateNested()
  clinicalInfo: ClinicalInfo;

  @IsEnum(TestStatus)
  status: TestStatus;

  @IsNotEmpty()
  @IsNumber()
  nbPeriods: number;

  @IsNotEmpty()
  @IsNumber()
  periodLen: number;

  @IsObject()
  @IsNotEmptyObject()
  statistics: { analysisToPerform: AnalyseType };

  @IsObject()
  @IsNotEmptyObject()
  randomization: RandomizationStrategy;

  @IsOptional()
  @IsDate()
  beginningDate?: Date;

  @IsOptional()
  @IsDate()
  endingDate?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  substancesSequence: string[];

  @IsOptional()
  @IsArray()
  administrationSchema: AdministrationSchema[];

  @IsArray()
  substances: Substance[];

  @IsArray()
  posologies: SubstancePosologies[];

  @IsArray()
  monitoredVariables: Variable[];

  @IsObject()
  @IsNotEmptyObject()
  meta_info: {
    creationDate: Date;
    emailSendingDate?: Date;
    showPeriodQuestions: boolean;
  };
}
