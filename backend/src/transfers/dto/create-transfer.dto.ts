import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty({ example: '1234567890', description: 'Source account number' })
  @IsString()
  @IsNotEmpty()
  fromAccountNumber: string;

  @ApiProperty({ example: '0987654321', description: 'Destination account number' })
  @IsString()
  @IsNotEmpty()
  toAccountNumber: string;

  @ApiProperty({ example: 100.50, description: 'Amount to transfer', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;
}