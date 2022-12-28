import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { CreatePhysicianDto } from './dto/create-physician.dto';
import { UpdatePhysicianDto } from './dto/update-physician.dto';
import { Physician, PhysicianDoc } from './schemas/physician.schema';

/**
 * Service managing physicians.
 */
@Injectable()
export class PhysiciansService {
  constructor(
    @InjectModel(Physician.name)
    private physicianModel: Model<PhysicianDoc>,
  ) {}

  /**
   * Create a new physician.
   * @param createPhysicianDto Physician dto.
   * @returns The physician document or a BadRequest exception.
   */
  async createPhysician(createPhysicianDto: CreatePhysicianDto) {
    try {
      return await this.physicianModel.create(createPhysicianDto);
    } catch (error) {
      if (error instanceof MongooseError.ValidationError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Find a physician by id.
   * @param id Physician id.
   * @returns The physician document or null.
   */
  async findById(id: string) {
    const response = await this.physicianModel
      .findById(id)
      .lean({ getters: true });
    return { response };
  }

  /**
   * Find a physician by email.
   * @param email Physician email.
   * @returns The physician document or null.
   */
  async findByEmail(email: string) {
    const response = await this.physicianModel
      .findOne({ email: email })
      .lean({ getters: true });
    return { response };
  }

  /**
   * Update a physician.
   * @param id Physician id.
   * @param updatePhysicianDto Physician dto.
   * @returns A message indicating a successful update or a BadRequest exception.
   */
  async update(id: string, updatePhysicianDto: UpdatePhysicianDto) {
    try {
      const response = await this.physicianModel
        .findByIdAndUpdate(id, updatePhysicianDto, { returnDocument: 'after' })
        .lean({ getters: true });
      if (response === null) {
        throw new Error('Physician not found');
      }
      return { msg: 'updated' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Delete a physician.
   * @param id Physician id.
   * @returns A message indicating the document deletion.
   */
  async remove(id: string) {
    await this.physicianModel.findByIdAndDelete(id);
    return { msg: `Physician with id: "${id}" was removed` };
  }
}
