import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';

// Create app and start server.
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  app.enableCors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL2],
    credentials: true,
  });
  // using session for captcha challenges
  app.use(
    session({
      name: 'captcha',
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: 'lax',
        // sameSite: 'none',
        // secure: true,
        path: '/captcha',
        maxAge: 1000 * 60 * 75, // 75 minutes
      },
    }),
  );

  // OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Nof1-API')
    .setDescription('The N-of-1 API doc')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
