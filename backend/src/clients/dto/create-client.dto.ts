import { IsString, IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: '12345678', description: 'DNI del cliente' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  dni: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+51987654321' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del cliente' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}