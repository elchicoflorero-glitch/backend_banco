import { IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionDto {
  @ApiProperty({ example: 'trans-id-here', description: 'Transaction ID' })
  @IsString()
  id: string;

  @ApiProperty({ example: 100.50, description: 'Transaction amount' })
  amount: Decimal;

  @ApiProperty({ example: 'source-account-id', description: 'Source account ID' })
  @IsString()
  sourceAccountId: string;

  @ApiProperty({ example: 'destination-account-id', description: 'Destination account ID' })
  @IsString()
  destinationAccountId: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Transaction timestamp' })
  @IsDateString()
  createdAt: Date;

  // Optional: Include related account information
  sourceAccount?: {
    id: string;
    accountNumber: string;
    client: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };

  destinationAccount?: {
    id: string;
    accountNumber: string;
    client: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}
