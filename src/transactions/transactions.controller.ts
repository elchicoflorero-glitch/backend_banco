import { Controller, Get, Query, UseGuards, Request, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DepositDto } from './dto/deposit.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions with optional filters' })
  @ApiResponse({ status: 200, description: 'Return filtered transactions' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Filter by account ID' })
  @ApiQuery({ name: 'accountNumber', required: false, description: 'Filter by account number' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter (ISO format)' })
  async findAll(
    @Request() req,
    @Query('accountId') accountId?: string,
    @Query('accountNumber') accountNumber?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // If user is a client, only return their transactions
    if (req.user.role === 'client') {
      return this.transactionsService.findByClientId(req.user.id);
    }

    if (accountId) {
      return this.transactionsService.findByAccount(accountId);
    }

    if (accountNumber) {
      return this.transactionsService.findByAccountNumber(accountNumber);
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      return this.transactionsService.findByDateRange(start, end);
    }

    return this.transactionsService.findAll();
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money to an account' })
  @ApiResponse({ status: 201, description: 'Deposit completed successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async deposit(@Body() depositDto: DepositDto, @Request() req) {
    // Only admins and managers can make deposits
    if (req.user.role === 'client') {
      throw new Error('Clients cannot make deposits');
    }

    try {
      // Pass userId only for admin/manager roles, undefined for others
      const userId = req.user.role === 'client' ? undefined : req.user.id;
      const transaction = await this.transactionsService.deposit(
        depositDto.accountId,
        depositDto.amount,
        depositDto.description,
        userId,
      );
      return {
        success: true,
        message: 'Depósito realizado exitosamente',
        transaction,
      };
    } catch (err: any) {
      throw err;
    }
  }
}