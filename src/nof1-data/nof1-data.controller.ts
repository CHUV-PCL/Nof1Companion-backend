import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNof1DataDto } from './dto/create-nof1-data.dto';
import { UpdateNof1DataDto } from './dto/update-nof1-data.dto';
import { Nof1DataService } from './nof1-data.service';

/**
 * Controller managing endpoints for health variables data of N-of-1 tests.
 */
@ApiBearerAuth()
@ApiTags('nof1-data')
@Controller('nof1-data')
export class Nof1DataController {
  constructor(private readonly nof1DataService: Nof1DataService) {}

  /**
   * Creates a N-of-1 health variables data document.
   * @param createNof1DataDto Dto representing data.
   * @returns The id of the created document or a BadRequest message.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createNof1DataDto: CreateNof1DataDto) {
    return this.nof1DataService.create(createNof1DataDto);
  }

  /**
   * Retrieves a N-of-1 health variables data document.
   * @param testId The id of the document to retrieve.
   * @returns The document.
   */
  @Get(':testId')
  findOne(@Param('testId') testId: string) {
    return this.nof1DataService.findOne(testId);
  }

  /**
   * Retrieves a N-of-1 test document and its health variables data document, if any.
   * @param testId The id of the N-of-1 test.
   * @returns An object containing the N-of-1 test document and its associated
   * health variables data if any.
   */
  @Get('/patient/:testId')
  patientData(@Param('testId') testId: string) {
    return this.nof1DataService.patientData(testId);
  }

  /**
   * Retrieves an XML string representing an XML file, in ODM-XML format,
   * containing all the information about a N-of-1 test and its patient's data.
   * @param testId N-of-1 test id.
   * @returns An object containing the xml string.
   */
  @Get('/xml/:testId')
  xml(@Param('testId') testId: string) {
    return this.nof1DataService.xml(testId);
  }

  /**
   * Retrieves an XML string representing an XML file, in ODM-XML format,
   * containing all the information about a N-of-1 test and its patient's data.
   * Identifying information about people involved in the N-of-1 test is hashed.
   * @param testId N-of-1 test id.
   * @returns An object containing the xml string.
   */
  @Get('/xml/anonymous/:testId')
  anonymousXml(@Param('testId') testId: string) {
    return this.nof1DataService.anonymousXml(testId);
  }

  /**
   * Retrieves an XML string representing an XML file, in ODM-XML format,
   * containing all the information about a N-of-1 test and its patient's data.
   * Identifying information about people involved in the N-of-1 test is encrypted.
   * @param testId N-of-1 test id.
   * @returns An object containing the xml string.
   */
  @Get('/xml/encrypted/:testId')
  encryptedXml(@Param('testId') testId: string) {
    return this.nof1DataService.encryptedXml(testId);
  }

  /**
   * Updates a N-of-1 health variables data document.
   * @param testId The id of the document.
   * @param updateNof1DataDto Dto representing data.
   * @returns A message indicating a successful update or
   * a BadRequest message.
   */
  @Patch(':testId')
  update(
    @Param('testId') testId: string,
    @Body() updateNof1DataDto: UpdateNof1DataDto,
  ) {
    return this.nof1DataService.update(testId, updateNof1DataDto);
  }

  /**
   * Updates a N-of-1 health variables data document (through a patient request).
   * @param testId The id of the N-of-1 test.
   * @param updateNof1DataDto Dto representing data.
   * @returns A message indicating a successful update or
   * a BadRequest message.
   */
  @Patch('/patient/:testId')
  updatePatient(
    @Param('testId') testId: string,
    @Body() updateNof1DataDto: UpdateNof1DataDto,
  ) {
    return this.nof1DataService.updatePatientData(testId, updateNof1DataDto);
  }

  /**
   * Deletes a N-of-1 health variables data document.
   * @param testId The id of the N-of-1 test.
   * @returns A message indicating the document deletion.
   */
  @Delete(':testId')
  remove(@Param('testId') testId: string) {
    return this.nof1DataService.remove(testId);
  }
}
