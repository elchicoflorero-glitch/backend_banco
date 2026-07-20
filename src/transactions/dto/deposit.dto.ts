import { IsNotEmpty, IsString, Min, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({ example: 'account-id-123', description: 'ID de la cuenta destino' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ example: 1000.50, description: 'Monto a depositar' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'Depósito inicial', description: 'Descripción del depósito (opcional)' })
  @IsString()
  @IsOptional()
  description?: string;
}
