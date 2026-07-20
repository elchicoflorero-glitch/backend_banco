import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password, role } = createUserDto;

    // Check if username already exists using findFirst
    const existingUsername = await this.prisma.user.findFirst({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists using findFirst
    const existingEmail = await this.prisma.user.findFirst({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user with role as string
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'user',
      },
    });

    // Log the creation
    await this.auditLogService.create({
      operation: 'CREATE',
      userId: user.id,
      entityType: 'USER',
      entityId: user.id,
      details: {
        username: user.username,
        email: user.email,
        role: user.role,
        action: 'User account created',
      },
    });

    return user;
  }

  async findById(id: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.mapToUserDto(user) : null;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    return user;
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => this.mapToUserDto(user));
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUserId?: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const updateData: any = {};
    const auditDetails: any = { action: 'User updated' };

    // Check if new username is unique
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.prisma.user.findFirst({
        where: { username: updateUserDto.username },
      });
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
      updateData.username = updateUserDto.username;
      auditDetails.usernameUpdated = updateUserDto.username;
    }

    // Check if new email is unique
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { email: updateUserDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
      updateData.email = updateUserDto.email;
      auditDetails.emailUpdated = updateUserDto.email;
    }

    // Hash new password if provided
    if (updateUserDto.password) {
      if (updateUserDto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }
      updateData.password = await hash(updateUserDto.password, 10);
      auditDetails.passwordUpdated = true;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Log the update
    const auditUserId = currentUserId || id;
    await this.auditLogService.create({
      operation: 'UPDATE',
      userId: auditUserId,
      entityType: 'USER',
      entityId: id,
      details: auditDetails,
    });

    return this.mapToUserDto(updatedUser);
  }

  async delete(id: string, currentUserId?: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    // Log the deletion
    const auditUserId = currentUserId || id;
    await this.auditLogService.create({
      operation: 'DELETE',
      userId: auditUserId,
      entityType: 'USER',
      entityId: id,
      details: {
        username: user.username,
        email: user.email,
        action: 'User account deleted',
      },
    });
  }

  private mapToUserDto(user: any): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
