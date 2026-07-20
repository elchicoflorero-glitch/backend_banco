import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  @IsNotEmpty()
  operation: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  entityType?: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsObject()
  @IsOptional()
  details?: any;
}