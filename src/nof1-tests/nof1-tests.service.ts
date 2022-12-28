import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { CreateNof1TestDto } from './dto/create-nof1-test.dto';
import { UpdateNof1TestDto } from './dto/update-nof1-test.dto';
import { Nof1Test, Nof1TestDoc } from './schemas/nof1Test.schema';

/**
 * Service managing N-of-1 tests documents.
 */
@Injectable()
export class Nof1TestsService {
  constructor(
    @InjectModel(Nof1Test.name)
    private readonly nof1Model: Model<Nof1TestDoc>,
  ) {}

  /**
   * Create a N-of-1 test document.
   * @param createNof1TestDto Dto representing a N-of-1 test.
   * @returns The id of the created document or a BadRequest exception.
   */
  async create(createNof1TestDto: CreateNof1TestDto) {
    try {
      const nof1 = await this.nof1Model.create(createNof1TestDto);
      const uid =
        nof1.participants.nof1Physician.institution.toUpperCase() +
        '-' +
        nof1.id;
      nof1.set('uid', uid);
      nof1.save();
      return { id: uid };
    } catch (error) {
      if (error instanceof MongooseError.ValidationError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * @returns All N-of-1 tests documents.
   */
  findAll() {
    return this.nof1Model.find().lean({ getters: true });
  }

  /**
   * Retrieve a N-of-1 test document by id.
   * @param id The id of the document.
   * @returns The document.
   */
  async findOne(id: string) {
    const test = await this.nof1Model
      .findOne({ uid: id })
      .lean({ getters: true });
    return { test };
  }

  /**
   * Retrieve a list of N-of-1 tests documents.
   * @param ids The list of ids of documents to retrieve.
   * @returns The list of documents.
   */
  findMany(ids: string[]) {
    return this.nof1Model.find({ uid: { $in: ids } }).lean({ getters: true });
  }

  /**
   * Update a N-of-1 test document.
   * @param id The id of the document.
   * @param updateNof1TestDto Dto representing fields to update.
   * @returns A message indicating a successful update or a BadRequest exception.
   */
  async update(id: string, updateNof1TestDto: UpdateNof1TestDto) {
    try {
      const doc = await this.nof1Model
        .findOneAndUpdate({ uid: id }, updateNof1TestDto)
        .lean({ getters: true });
      return { msg: `updated : ${doc.uid}` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Delete a N-of-1 test document.
   * @param id The id of the document.
   * @returns A message indicating the document deletion.
   */
  async remove(id: string) {
    await this.nof1Model.findOneAndDelete({ uid: id });
    return { msg: `N-of-1 test with id: "${id}" was deleted` };
  }
}
