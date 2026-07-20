import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async create(createAuditLogDto: CreateAuditLogDto) {
    // Build data object, excluding userId if it's not provided
    const data: any = {
      operation: createAuditLogDto.operation,
      entityType: createAuditLogDto.entityType,
      entityId: createAuditLogDto.entityId,
      details: createAuditLogDto.details,
    };

    // Only include userId if provided, not null, and not empty string
    if (createAuditLogDto.userId && typeof createAuditLogDto.userId === 'string' && createAuditLogDto.userId.trim()) {
      data.userId = createAuditLogDto.userId;
    }

    return this.prisma.auditLog.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOperation(operation: string) {
    return this.prisma.auditLog.findMany({
      where: { operation },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDateRange(startDate?: Date, endDate?: Date) {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    return this.prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}