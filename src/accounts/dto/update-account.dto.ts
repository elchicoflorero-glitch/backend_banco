import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty({ example: 'PEN', description: 'Currency of the account', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['PEN', 'USD', 'EUR'])
  currency?: string;
}
