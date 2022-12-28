import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Nof1TestsModule } from './nof1-tests/nof1-tests.module';
import { MailModule } from './mail/mail.module';
import { Nof1DataModule } from './nof1-data/nof1-data.module';
import { PhysiciansModule } from './persons/physicians/physicians.module';
import { PatientsModule } from './persons/patients/patients.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Module configuration.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      // async needed to let the ConfigModule be loaded first and allow access to process.env.VARIABLE.
      // https://docs.nestjs.com/fundamentals/async-providers
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PhysiciansModule,
    PatientsModule,
    Nof1TestsModule,
    MailModule,
    Nof1DataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
