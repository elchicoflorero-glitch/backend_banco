import { Controller, Get, Query, UseGuards, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs with optional filters' })
  @ApiResponse({ status: 200, description: 'Return filtered audit logs' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'operation', required: false, description: 'Filter by operation type' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter (ISO format)' })
  async findAll(
    @Query('userId') userId?: string,
    @Query('operation') operation?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (userId) {
      return this.auditLogService.findByUser(userId);
    }

    if (operation) {
      return this.auditLogService.findByOperation(operation);
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      return this.auditLogService.findByDateRange(start, end);
    }

    return this.auditLogService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiResponse({ status: 200, description: 'Return audit log detail' })
  @ApiResponse({ status: 404, description: 'Audit log not found' })
  async findById(@Param('id') id: string) {
    const auditLog = await this.auditLogService.findById(id);
    
    if (!auditLog) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return auditLog;
  }
}