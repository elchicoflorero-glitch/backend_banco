import { Module } from '@nestjs/common';
import { PDFReportService } from './pdf-report.service';
import { PDFReportController } from './pdf-report.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PDFReportController],
  providers: [PDFReportService],
  exports: [PDFReportService],
})
export class PDFReportModule {}
