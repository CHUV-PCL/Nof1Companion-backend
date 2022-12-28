import { MailData, XlsxSchema } from '../mail/dto/pharmaMail.dto';
import { utils, WorkSheet, write } from 'xlsx';
import { defaultCellWidth, xlsxFilename } from './constants';

/**
 * Export the data provided in parameters into an excel file.
 * @param data Data to export in xlsx.
 * @returns An object containing the buffer formatted excel file and its filename.
 */
export const xlsx = async (data: MailData) => {
  const filename = xlsxFilename;
  const workbook = utils.book_new();
  workbook.Props = {
    Title: filename,
    CreatedDate: new Date(),
  };

  const wsInfoParticipants = wsParticipants(
    data.patientInfos,
    data.physicianInfos,
    data.nof1PhysicianInfos,
  );
  utils.book_append_sheet(workbook, wsInfoParticipants, 'Participants');

  // administration schema worksheet
  const lastHeader =
    data.administrationSchema.headers[
      data.administrationSchema.headers.length - 1
    ];

  const wsSchema = wsAdministrationSchema(
    data.administrationSchema.headers,
    lastHeader,
    data.administrationSchema.schema,
    data.comments,
  );

  // add administration schema recap data to an offset position
  let offset = 0;
  data.substancesRecap.forEach((recap) => {
    utils.sheet_add_aoa(wsSchema, [[], ...recap], {
      origin: { r: 1 + offset, c: lastHeader.length + 1 },
    });
    offset += recap.length + 1;
  });

  if (data.decreasingSchema.schema.length > 0) {
    addDecreasingSchema(wsSchema, data.decreasingSchema);
  }

  utils.book_append_sheet(workbook, wsSchema, 'Administration schema');

  const xlsbuf: Buffer = write(workbook, {
    bookType: 'xlsx',
    type: 'buffer',
  });

  return { filename, xlsbuf };
};

/**
 * Creates the participants worksheet.
 * @param patientInfos Patient information.
 * @param physicianInfos Physician information.
 * @param nof1PhysicianInfos Nof1 physician information.
 * @returns The worksheet.
 */
const wsParticipants = (
  patientInfos: string[][],
  physicianInfos: string[][],
  nof1PhysicianInfos: string[][],
) => {
  const participants = [
    ...patientInfos,
    [''], // empty row (space)
    ...physicianInfos,
    [''],
    ...nof1PhysicianInfos,
  ];
  const wsParticipants = utils.aoa_to_sheet(participants);
  // determine column cell width
  wsParticipants['!cols'] = patientInfos[1].map((e) => ({
    wch: Math.max(e.length, defaultCellWidth),
  }));

  return wsParticipants;
};

/**
 * Creates the substances administration schema worksheet.
 * @param schemaHeaders Headers.
 * @param lastHeader Last row of headers.
 * @param schema Administration schema.
 * @param comments Comments displayed next to the header.
 * @returns The worksheet.
 */
const wsAdministrationSchema = (
  schemaHeaders: string[][],
  lastHeader: string[],
  schema: XlsxSchema,
  comments: string[],
) => {
  // header
  const wsSchema = utils.aoa_to_sheet(schemaHeaders);
  wsSchema['!merges'] = [
    { s: { c: 0, r: 0 }, e: { c: 2, r: 0 } }, // A1:C1
    { s: { c: 3, r: 0 }, e: { c: 5, r: 0 } }, // D1:F1
    { s: { c: 6, r: 0 }, e: { c: 8, r: 0 } }, // G1:I1
    { s: { c: 9, r: 0 }, e: { c: 11, r: 0 } }, // J1:L1
    { s: { c: 12, r: 0 }, e: { c: 14, r: 0 } }, // M1:O1
  ];
  // determine column widths using last header row
  wsSchema['!cols'] = lastHeader.map((h) => ({
    wch: Math.max(h.length, defaultCellWidth),
  }));

  // data
  utils.sheet_add_json(wsSchema, schema, {
    skipHeader: true,
    origin: -1,
  });
  // header comments
  utils.sheet_add_aoa(wsSchema, [comments], {
    origin: { r: 0, c: lastHeader.length + 1 },
  });

  return wsSchema;
};

/**
 * Add the decreasing dosage schema below the substances administration schema.
 * @param wsSchema Substances administration schema.
 * @param decreasingSchema Decreasing dosage schema.
 */
const addDecreasingSchema = (
  wsSchema: WorkSheet,
  decreasingSchema: {
    headers: string[][];
    schema: XlsxSchema;
  },
) => {
  utils.sheet_add_aoa(wsSchema, [[], [], ...decreasingSchema.headers], {
    origin: -1,
  });
  utils.sheet_add_json(wsSchema, decreasingSchema.schema, {
    skipHeader: true,
    origin: -1,
  });
};
