import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient, PatientDoc } from './schemas/patient.schema';

/**
 * Service managing patients.
 */
@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name)
    private patientModel: Model<PatientDoc>,
  ) {}

  /**
   * Create a new patient.
   * @param createPatientDto Patient dto.
   * @returns The patient document or a BadRequest exception.
   */
  async createPatient(createPatientDto: CreatePatientDto) {
    try {
      return await this.patientModel.create(createPatientDto);
    } catch (error) {
      if (error instanceof MongooseError.ValidationError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Find a patient by id.
   * @param id Patient id.
   * @returns The patient document or null.
   */
  async findById(id: string) {
    const response = await this.patientModel
      .findById(id)
      .lean({ getters: true });
    return { response };
  }

  /**
   * Find a patient by email.
   * @param email Patient email.
   * @returns The patient document or null.
   */
  async findByEmail(email: string) {
    const response = await this.patientModel
      .findOne({ email: email })
      .lean({ getters: true });
    return { response };
  }

  /**
   * Update a patient.
   * @param id Patient id.
   * @param updatePatientDto Patient dto.
   * @returns A message indicating a successful update or a BadRequest exception.
   */
  async update(id: string, updatePatientDto: UpdatePatientDto) {
    try {
      const response = await this.patientModel
        .findByIdAndUpdate(id, updatePatientDto, { returnDocument: 'after' })
        .lean({ getters: true });
      if (response === null) {
        throw new Error('Patient not found');
      }
      return { msg: 'updated' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Delete a patient.
   * @param id Patient id.
   * @returns A message indicating the document deletion.
   */
  async remove(id: string) {
    await this.patientModel.findByIdAndDelete(id);
    return { msg: `Patient with id: "${id}" was removed` };
  }
}
