import { Controller, Post, Get, Body, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Withdrawals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('withdrawals')
export class WithdrawalsController {
  private logger = new Logger('WithdrawalsController');

  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  @ApiOperation({ summary: 'Withdraw money from an account' })
  @ApiResponse({ status: 201, description: 'Withdrawal completed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - insufficient balance or invalid data' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  withdraw(@Body() createWithdrawalDto: CreateWithdrawalDto, @Request() req) {
    this.logger.debug('💰 RETIRO - JSON Recibido:', JSON.stringify(createWithdrawalDto, null, 2));
    // For clients, pass undefined userId to avoid foreign key constraint issues
    const userId = req.user.role === 'client' ? undefined : req.user.id;
    const result = this.withdrawalsService.withdraw(createWithdrawalDto, userId);
    this.logger.debug('✅ RETIRO - JSON Respuesta será enviado');
    return result;
  }

  @Get('history')
  @ApiOperation({ summary: 'Get withdrawal history' })
  @ApiResponse({ status: 200, description: 'Withdrawal history retrieved successfully' })
  getWithdrawalHistory(@Request() req) {
    this.logger.debug('📊 HISTORIAL DE RETIROS - Obteniendo...');
    return this.withdrawalsService.getWithdrawalHistory(req.user.id);
  }
}
