import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * Controller managing patients endpoints.
 */
@ApiBearerAuth()
@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  /**
   * Create a new patient.
   * @param createPatientDto Patient dto.
   * @returns The patient document or a BadRequest exception.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.createPatient(createPatientDto);
  }

  /**
   * Find a patient by id.
   * @param id Patient id.
   * @returns The patient document or null.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  /**
   * Find a patient by email.
   * @param email Patient email.
   * @returns The patient document or null.
   */
  @Get('find/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.patientsService.findByEmail(email);
  }

  /**
   * Update a patient.
   * @param id Patient id.
   * @param updatePatientDto Patient dto.
   * @returns A message indicating a successful update or a BadRequest exception.
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  /**
   * Delete a patient.
   * @param id Patient id.
   * @returns A message indicating the document deletion.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}
