import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    this.logger.debug('📝 REGISTRO - JSON Recibido:', JSON.stringify(registerDto, null, 2));
    const result = await this.authService.register(registerDto);
    this.logger.debug('✅ REGISTRO - JSON Respuesta:', JSON.stringify(result, null, 2));
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    this.logger.debug('🔐 LOGIN - JSON Recibido:', JSON.stringify(loginDto, null, 2));
    const result = await this.authService.login(loginDto);
    this.logger.debug('✅ LOGIN - JSON Respuesta:', JSON.stringify(result, null, 2));
    return result;
  }
}