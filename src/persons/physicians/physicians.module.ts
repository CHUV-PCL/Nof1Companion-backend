import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhysiciansController } from './physicians.controller';
import { PhysiciansService } from './physicians.service';
import { Physician, PhysicianSchema } from './schemas/physician.schema';

/**
 * Module configuration
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Physician.name,
        schema: PhysicianSchema,
      },
    ]),
  ],
  controllers: [PhysiciansController],
  providers: [PhysiciansService],
  exports: [PhysiciansService],
})
export class PhysiciansModule {}
