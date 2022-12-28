import { Module } from '@nestjs/common';
import { Nof1DataController } from './nof1-data.controller';
import { Nof1DataService } from './nof1-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Nof1Data, Nof1DataSchema } from './schemas/nof1Data.schema';
import { Nof1TestsModule } from '../nof1-tests/nof1-tests.module';

/**
 * Module configuration.
 */
@Module({
  imports: [
    Nof1TestsModule,
    MongooseModule.forFeature([
      { name: Nof1Data.name, schema: Nof1DataSchema },
    ]),
  ],
  controllers: [Nof1DataController],
  providers: [Nof1DataService],
})
export class Nof1DataModule {}
