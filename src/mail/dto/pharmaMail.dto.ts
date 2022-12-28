import { IsNotEmptyObject, IsObject } from 'class-validator';
import { AdministrationSchema } from '../../nof1-tests/@types/types';
import { MailDto } from './mail.dto';

export type XlsxSchema = (AdministrationSchema & {
  morningUnit: number;
  noonUnit: number;
  eveningUnit: number;
  nightUnit: number;
})[];

/**
 * Information required to generate the xlsx file about the N-of-1 test.
 */
export interface MailData {
  patientInfos: string[][];
  physicianInfos: string[][];
  nof1PhysicianInfos: string[][];
  administrationSchema: {
    headers: string[][];
    schema: XlsxSchema;
  };
  substancesRecap: (string | number)[][][];
  comments: string[];
  decreasingSchema: {
    headers: string[][];
    schema: XlsxSchema;
  };
}

export class PharmaMailDto extends MailDto {
  /**
   * Information to generate the xlsx file.
   */
  @IsObject()
  @IsNotEmptyObject()
  data: MailData;
}
