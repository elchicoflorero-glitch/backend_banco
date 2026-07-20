import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PDFReportService } from './pdf-report.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
export class PDFReportController {
  constructor(private reportService: PDFReportService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateReport(
    @Body()
    body: {
      accountId: string;
      reportType: 'statement' | 'transactions' | 'account_summary';
    },
  ) {
    try {
      const fileName = `${body.reportType}_${body.accountId}_${Date.now()}.pdf`;
      const report = await this.reportService.createReport(
        body.accountId,
        body.reportType,
        fileName,
      );

      return {
        success: true,
        message: 'Report generated successfully',
        report: {
          id: report.id,
          fileName: report.fileName,
          generatedAt: report.generatedAt,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Error generating report',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('account/:accountId')
  @UseGuards(JwtAuthGuard)
  async getAccountReports(
    @Param('accountId') accountId: string,
    @Query('limit') limit = 10,
    @Query('skip') skip = 0,
  ) {
    try {
      const reports = await this.reportService.getReportsByAccountId(
        accountId,
        limit,
        skip,
      );

      return {
        success: true,
        reports,
      };
    } catch (error) {
      throw new HttpException(
        'Error retrieving reports',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('account/:accountId/active')
  @UseGuards(JwtAuthGuard)
  async getActiveReports(
    @Param('accountId') accountId: string,
    @Query('limit') limit = 10,
    @Query('skip') skip = 0,
  ) {
    try {
      const reports = await this.reportService.getActiveReportsByAccountId(
        accountId,
        limit,
        skip,
      );

      return {
        success: true,
        reports,
      };
    } catch (error) {
      throw new HttpException(
        'Error retrieving active reports',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':reportId')
  @UseGuards(JwtAuthGuard)
  async getReport(@Param('reportId') reportId: string) {
    try {
      const report = await this.reportService.getReportById(reportId);

      if (!report) {
        throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
      }

      // Incrementar contador de descargas
      await this.reportService.incrementDownloadCount(reportId);

      return {
        success: true,
        report,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error retrieving report',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('account/:accountId/stats')
  @UseGuards(JwtAuthGuard)
  async getReportStats(@Param('accountId') accountId: string) {
    try {
      const stats = await this.reportService.getReportStats(accountId);

      return {
        success: true,
        stats,
      };
    } catch (error) {
      throw new HttpException(
        'Error retrieving report stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('account/:accountId/by-type')
  @UseGuards(JwtAuthGuard)
  async getReportsByType(@Param('accountId') accountId: string) {
    try {
      const reports = await this.reportService.getReportsByType(accountId);

      return {
        success: true,
        reports,
      };
    } catch (error) {
      throw new HttpException(
        'Error retrieving reports by type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':reportId')
  @UseGuards(JwtAuthGuard)
  async deleteReport(@Param('reportId') reportId: string) {
    try {
      await this.reportService.deleteReport(reportId);

      return {
        success: true,
        message: 'Report deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Error deleting report',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
