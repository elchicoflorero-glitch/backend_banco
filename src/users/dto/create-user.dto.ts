import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minimum: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin', 'manager'], required: false })
  @IsOptional()
  @IsIn(['user', 'admin', 'manager'])
  role?: string;
}
