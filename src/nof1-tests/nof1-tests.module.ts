import { Module } from '@nestjs/common';
import { Nof1TestsService } from './nof1-tests.service';
import { Nof1TestsController } from './nof1-tests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Nof1Test, Nof1TestSchema } from './schemas/nof1Test.schema';

/**
 * Module configuration
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Nof1Test.name, schema: Nof1TestSchema },
    ]),
  ],
  controllers: [Nof1TestsController],
  providers: [Nof1TestsService],
  exports: [Nof1TestsService],
})
export class Nof1TestsModule {}
