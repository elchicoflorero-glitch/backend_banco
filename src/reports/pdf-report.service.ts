import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PDFReportService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea un nuevo reporte PDF
   */
  async createReport(
    accountId: string,
    reportType: 'statement' | 'transactions' | 'account_summary',
    fileName: string,
    expiryDays: number = 30,
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    return this.prisma.pDFReport.create({
      data: {
        accountId,
        reportType,
        fileName,
        expiresAt,
      },
    });
  }

  /**
   * Obtiene un reporte por ID
   */
  async getReportById(reportId: string) {
    return this.prisma.pDFReport.findUnique({
      where: { id: reportId },
    });
  }

  /**
   * Obtiene todos los reportes de una cuenta
   */
  async getReportsByAccountId(accountId: string, limit = 10, skip = 0) {
    return this.prisma.pDFReport.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    });
  }

  /**
   * Obtiene reportes activos (no expirados) de una cuenta
   */
  async getActiveReportsByAccountId(
    accountId: string,
    limit = 10,
    skip = 0,
  ) {
    return this.prisma.pDFReport.findMany({
      where: {
        accountId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    });
  }

  /**
   * Incrementa el contador de descargas
   */
  async incrementDownloadCount(reportId: string) {
    return this.prisma.pDFReport.update({
      where: { id: reportId },
      data: {
        downloadCount: {
          increment: 1,
        },
        lastDownloadAt: new Date(),
      },
    });
  }

  /**
   * Actualiza la ruta S3 del reporte
   */
  async updateS3Path(reportId: string, s3Path: string, fileSize: number) {
    return this.prisma.pDFReport.update({
      where: { id: reportId },
      data: {
        s3Path,
        fileSize,
      },
    });
  }

  /**
   * Elimina un reporte
   */
  async deleteReport(reportId: string) {
    return this.prisma.pDFReport.delete({
      where: { id: reportId },
    });
  }

  /**
   * Limpia reportes expirados
   */
  async cleanExpiredReports() {
    return this.prisma.pDFReport.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /**
   * Obtiene estadísticas de reportes de una cuenta
   */
  async getReportStats(accountId: string) {
    const [total, active, downloads] = await Promise.all([
      this.prisma.pDFReport.count({
        where: { accountId },
      }),
      this.prisma.pDFReport.count({
        where: {
          accountId,
          expiresAt: {
            gt: new Date(),
          },
        },
      }),
      this.prisma.pDFReport.aggregate({
        where: { accountId },
        _sum: {
          downloadCount: true,
        },
      }),
    ]);

    return {
      totalReports: total,
      activeReports: active,
      expiredReports: total - active,
      totalDownloads: downloads._sum.downloadCount || 0,
    };
  }

  /**
   * Obtiene reportes agrupados por tipo
   */
  async getReportsByType(accountId: string) {
    const reports = await this.prisma.pDFReport.groupBy({
      by: ['reportType'],
      where: { accountId },
      _count: true,
    });

    return reports.map((report) => ({
      type: report.reportType,
      count: report._count,
    }));
  }
}
