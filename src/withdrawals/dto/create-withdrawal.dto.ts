import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWithdrawalDto {
  @ApiProperty({ example: '1234567890', description: 'Account number to withdraw from' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ example: 100.50, description: 'Amount to withdraw', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: 'ATM Withdrawal', description: 'Withdrawal reason/description', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
