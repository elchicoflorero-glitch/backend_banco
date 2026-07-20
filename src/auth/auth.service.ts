import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private clientsService: ClientsService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Crear el usuario
    const user = await this.usersService.create(registerDto);
    
    // Enviar email de bienvenida con credenciales
    try {
      await this.emailService.sendWelcomeEmail(
        user.email,
        user.username,
        registerDto.password, // La contraseña en texto plano viene del DTO
        user.email, // Usar email como nombre completo si no hay más info
      );
    } catch (emailError) {
      console.log('⚠️ Failed to send welcome email:', emailError.message);
      // No lanzar error aquí, el usuario fue creado exitosamente
    }

    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    // First, try to find a user
    let user = null;
    try {
      user = await this.usersService.findByUsername(loginDto.username);
    } catch (error) {
      // User not found, try to find a client by DNI
      try {
        const client = await this.clientsService.findByDni(loginDto.username);
        console.log('🔍 Client found:', { dni: client.dni, id: client.id });
        console.log('🔐 Comparing password:', loginDto.password, 'with hash:', client.password);

        // Verify the password for the client
        const isPasswordValid = await compare(loginDto.password, client.password);
        console.log('✅ Password valid:', isPasswordValid);

        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: client.dni, sub: client.id, role: 'client' };
        const token = this.jwtService.sign(payload);

        // Try to log the login event, but don't fail if it doesn't work
        try {
          await this.prisma.auditLog.create({
            data: {
              operation: 'CLIENT_LOGIN',
              userId: client.id,
              entityType: 'CLIENT',
              entityId: client.id,
              details: { dni: client.dni, name: `${client.firstName} ${client.lastName}` },
            },
          });
        } catch (auditError) {
          console.log('⚠️ Failed to log audit event:', auditError.message);
        }

        return {
          access_token: token,
          user: {
            id: client.id,
            username: client.dni,
            email: client.email,
            role: 'client',
          },
        };
      } catch (clientError) {
        console.log('❌ Client login error:', clientError.message);
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    // Verify the password for the user
    const isPasswordValid = await compare(loginDto.password, user.password);
    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roleName = typeof user.role === 'string' ? user.role : user.role?.name || 'user';
    const payload = { username: user.username, sub: user.id, role: roleName };
    const token = this.jwtService.sign(payload);

    // Log the login event
    try {
      await this.prisma.auditLog.create({
        data: {
          operation: 'LOGIN',
          userId: user.id,
          entityType: 'USER',
          entityId: user.id,
          details: { username: user.username, role: roleName },
        },
      });
    } catch (auditError) {
      console.log('⚠️ Failed to log audit event:', auditError.message);
    }

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: roleName,
      },
    };
  }

  async validateUser(payload: any) {
    // For clients, the sub is the client ID
    if (payload.role === 'client') {
      return this.clientsService.findOne(payload.sub);
    }
    // For users, the sub is the user ID
    return this.usersService.findById(payload.sub);
  }
}