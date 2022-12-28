import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

/**
 * Mail Module configuration.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      // JWT configuration.
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
