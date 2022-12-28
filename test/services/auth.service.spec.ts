import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../../src/users/users.service';
import * as bcrypt from 'bcrypt';
import { PhysiciansService } from '../../src/persons/physicians/physicians.service';

const testingModule = {
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UsersService, PhysiciansService],
};

const mockUser = {
  _id: '62976b342622eb8011ea59fb',
  email: 'nest@test.com',
  password: '1234',
};

const mockUsersService = {
  findByEmail: jest.fn().mockImplementation(async (email) => {
    const pwd = await bcrypt.hash(mockUser.password, 10);
    return {
      _id: mockUser._id,
      email: email,
      password: pwd,
    };
  }),
};

const mockPhysiciansService = {
  findByEmail: jest.fn().mockResolvedValue({
    response: { _id: mockUser._id, email: mockUser.email },
  }),
};

const createTestingModule = Test.createTestingModule(testingModule)
  .overrideProvider(UsersService)
  .useValue(mockUsersService)
  .overrideProvider(PhysiciansService)
  .useValue(mockPhysiciansService)
  .compile();

describe('AuthService - validateUser', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await createTestingModule;
    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user object when credentials are valid', async () => {
    const res = await service.validateUser(mockUser.email, mockUser.password);
    expect(res.email).toEqual(mockUser.email);
    expect(res.id).toEqual(mockUser._id);
  });

  it('should return null when credentials are invalid', async () => {
    const res = await service.validateUser('xxx', 'xxx');
    expect(res).toBeNull();
  });
});

describe('AuthService - validateLogin', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await createTestingModule;
    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should return JWT object when credentials are valid', async () => {
    const res = await service.login({
      email: mockUser.email,
      _id: mockUser._id,
    });
    expect(res.access_token).toBeDefined();
    expect(res.user).toEqual({ _id: mockUser._id, email: mockUser.email });
  });
});
