import { Controller, Post, Body, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transfers')
export class TransfersController {
  private logger = new Logger('TransfersController');

  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @ApiOperation({ summary: 'Transfer money between accounts' })
  @ApiResponse({ status: 201, description: 'Transfer completed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - insufficient balance or invalid data' })
  @ApiResponse({ status: 404, description: 'Source or destination account not found' })
  transfer(@Body() createTransferDto: CreateTransferDto, @Request() req) {
    this.logger.debug('💸 TRANSFERENCIA - JSON Recibido:', JSON.stringify(createTransferDto, null, 2));
    // For clients, pass undefined userId to avoid foreign key constraint issues
    const userId = req.user.role === 'client' ? undefined : req.user.id;
    const result = this.transfersService.transfer(createTransferDto, userId);
    this.logger.debug('✅ TRANSFERENCIA - JSON Respuesta será enviado');
    return result;
  }
}