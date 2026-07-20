import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ example: 'client-id-here', description: 'ID of the client who owns the account' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: 'PEN', description: 'Currency of the account', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['PEN', 'USD', 'EUR'])
  currency?: string;
}