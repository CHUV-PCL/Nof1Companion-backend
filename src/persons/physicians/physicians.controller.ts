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
import { PhysiciansService } from './physicians.service';
import { CreatePhysicianDto } from './dto/create-physician.dto';
import { UpdatePhysicianDto } from './dto/update-physician.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * Controller managing physicians endpoints.
 */
@ApiBearerAuth()
@ApiTags('physicians')
@Controller('physicians')
export class PhysiciansController {
  constructor(private readonly physiciansService: PhysiciansService) {}

  /**
   * Create a new physician.
   * @param createPhysicianDto Physician dto.
   * @returns The physician document or a BadRequest message.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPhysicianDto: CreatePhysicianDto) {
    return this.physiciansService.createPhysician(createPhysicianDto);
  }

  /**
   * Find a physician by id.
   * @param id Physician id.
   * @returns The physician document or null.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.physiciansService.findById(id);
  }

  /**
   * Find a physician by email.
   * @param email Physician email.
   * @returns The physician document or null.
   */
  @Get('find/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.physiciansService.findByEmail(email);
  }

  /**
   * Update a physician.
   * @param id Physician id.
   * @param updatePhysicianDto Physician dto.
   * @returns A message indicating a successful update or a BadRequest message.
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() updatePhysicianDto: UpdatePhysicianDto,
  ) {
    return this.physiciansService.update(id, updatePhysicianDto);
  }

  /**
   * Delete a physician.
   * @param id Physician id.
   * @returns A message indicating the document deletion.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.physiciansService.remove(id);
  }
}
