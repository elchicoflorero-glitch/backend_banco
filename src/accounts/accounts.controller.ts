import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Delete, Patch, Logger, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  private logger = new Logger('AccountsController');

  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account successfully created' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  create(@Body() createAccountDto: CreateAccountDto, @Request() req) {
    this.logger.debug('📝 CREAR CUENTA - JSON Recibido:', JSON.stringify(createAccountDto, null, 2));
    // Only admins and managers can create accounts
    if (req.user.role === 'user') {
      throw new ForbiddenException('Users cannot create accounts');
    }
    return this.accountsService.create(createAccountDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts or filter by client' })
  @ApiResponse({ status: 200, description: 'Return all accounts' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client ID' })
  findAll(@Request() req, @Query('clientId') clientId?: string) {
    this.logger.debug('📋 OBTENER CUENTAS - Filtro clientId:', clientId || 'Ninguno');
    
    // If user is a client, only return their own accounts
    if (req.user.role === 'client') {
      return this.accountsService.findByClient(req.user.id);
    }
    
    if (clientId) {
      return this.accountsService.findByClient(clientId);
    }
    return this.accountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiResponse({ status: 200, description: 'Return the account' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  findOne(@Param('id') id: string) {
    this.logger.debug('📋 OBTENER CUENTA - ID:', id);
    return this.accountsService.findOne(id);
  }

  @Get('by-number/:accountNumber')
  @ApiOperation({ summary: 'Get an account by account number' })
  @ApiResponse({ status: 200, description: 'Return the account' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  findByAccountNumber(@Param('accountNumber') accountNumber: string) {
    this.logger.debug('📋 OBTENER CUENTA - Número:', accountNumber);
    return this.accountsService.findByAccountNumber(accountNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiResponse({ status: 200, description: 'Account successfully updated' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto, @Request() req) {
    this.logger.debug('✏️ ACTUALIZAR CUENTA - ID:', id);
    this.logger.debug('✏️ ACTUALIZAR CUENTA - JSON Recibido:', JSON.stringify(updateAccountDto, null, 2));
    return this.accountsService.update(id, updateAccountDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account' })
  @ApiResponse({ status: 200, description: 'Account successfully deleted' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  delete(@Param('id') id: string, @Request() req) {
    this.logger.debug('🗑️ ELIMINAR CUENTA - ID:', id);
    return this.accountsService.delete(id, req.user.id);
  }
}