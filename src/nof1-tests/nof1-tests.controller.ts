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
import { Nof1TestsService } from './nof1-tests.service';
import { CreateNof1TestDto } from './dto/create-nof1-test.dto';
import { UpdateNof1TestDto } from './dto/update-nof1-test.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * Controller managing endpoints for N-of-1 tests.
 */
@ApiBearerAuth()
@ApiTags('nof1-tests')
@Controller('nof1-tests')
export class Nof1TestsController {
  constructor(private readonly nof1TestsService: Nof1TestsService) {}

  /**
   * Create a N-of-1 test document.
   * @param createNof1TestDto Dto representing a N-of-1 test.
   * @returns The id of the created document or a BadRequest message.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createNof1TestDto: CreateNof1TestDto) {
    return this.nof1TestsService.create(createNof1TestDto);
  }

  /**
   * Retrieve all N-of-1 tests documents.
   * @returns All N-of-1 tests documents.
   */
  @Get()
  findAll() {
    return this.nof1TestsService.findAll();
  }

  /**
   * Retrieve a N-of-1 test document by id.
   * @param id The id of the document.
   * @returns The document.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nof1TestsService.findOne(id);
  }

  /**
   * Retrieve a list of N-of-1 tests documents.
   * @param ids The list of ids of documents to retrieve.
   * @returns The list of documents.
   */
  @Post('/list')
  findMany(@Body('ids') ids: string[]) {
    return this.nof1TestsService.findMany(ids);
  }

  /**
   * Update a N-of-1 test document.
   * @param id The id of the document.
   * @param updateNof1TestDto Dto representing fields to update.
   * @returns A message indicating a successful update or a BadRequest message.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNof1TestDto: UpdateNof1TestDto,
  ) {
    return this.nof1TestsService.update(id, updateNof1TestDto);
  }

  /**
   * Delete a N-of-1 test document.
   * @param id The id of the document.
   * @returns A message indicating the document deletion.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nof1TestsService.remove(id);
  }
}
