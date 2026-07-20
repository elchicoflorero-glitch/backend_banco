import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                JWT_SECRET: 'test-secret',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('validate', () => {
    it('should validate user from JWT payload', async () => {
      const payload = { username: 'testuser', sub: 'user-123' };
      const now = new Date();
      const user = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        createdAt: now,
        updatedAt: now,
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);

      const result = await strategy.validate(payload);

      expect(result).toEqual(user);
      expect(authService.validateUser).toHaveBeenCalledWith(payload);
    });

    it('should return null when user validation fails', async () => {
      const payload = { username: 'testuser', sub: 'nonexistent' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      const result = await strategy.validate(payload);

      expect(result).toBeNull();
      expect(authService.validateUser).toHaveBeenCalledWith(payload);
    });
  });
});
