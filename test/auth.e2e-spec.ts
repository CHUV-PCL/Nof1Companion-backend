import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../src/users/users.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PhysiciansModule } from '../src/persons/physicians/physicians.module';

describe('E2E Authentication', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let request: any;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            const mongoUri = mongod.getUri();
            return { uri: mongoUri };
          },
        }),
        AuthModule,
        UsersModule,
        PhysiciansModule,
      ],
      providers: [ConfigService],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
    request = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should register a new user', async () => {
    const newUser = {
      email: 'nest@testing.com',
      password: '12345678',
      lastname: 'Test',
      firstname: 'nest',
      address: {
        street: 'Street',
        zip: 1000,
        city: 'Genève',
      },
      phone: '123456',
      institution: 'CHUV',
    };

    await request.post('/auth/register').send(newUser).expect(201);
  });

  it('should not register an invalid new user', async () => {
    const invalidUser = {
      email: 'nest',
      password: '1234',
      lastname: 'Test',
      firstname: 'nest',
      address: {
        street: "Rue J-P r'n'roll 2",
        zip: 1000,
        city: 'Genève',
      },
      phone: 'ab078000',
      institution: 'CHUV',
    };

    await request
      .post('/auth/register')
      .send(invalidUser)
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['email must be an email', 'phone must be a number string'],
        error: 'Bad Request',
      });
  });

  it('should not provide a JWT token to invalid user', async () => {
    await request
      .post('/auth/login')
      .send({ email: 'unkown@testing.com', password: '1234' })
      .expect(401)
      .expect({ statusCode: 401, message: 'Unauthorized' });
  });

  it('should get a JWT upon successful login', async () => {
    const loginReq = await request
      .post('/auth/login')
      .send({ email: 'nest@testing.com', password: '12345678' })
      .expect(201);

    expect(loginReq.body).toHaveProperty('access_token');
    const token = loginReq.body.access_token;
    expect(token).toBeDefined();
  });

  it('should access protected route with the obtained JWT', async () => {
    const loginReq = await request
      .post('/auth/login')
      .send({ email: 'nest@testing.com', password: '12345678' })
      .expect(201);

    return await request
      .get('/users/nest@testing.com')
      .set('Authorization', 'Bearer ' + loginReq.body.access_token)
      .expect(200);
  });
});
