import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // Tests temporalmente deshabilitados mientras se migra schema de roles
  // describe('register', () => {
  //   it('should call authService.register with correct parameters', async () => {
  //     // ...
  //   });
  // });

  // describe('login', () => {
  //   it('should call authService.login with correct parameters', async () => {
  //     // ...
  //   });
  // });
});
