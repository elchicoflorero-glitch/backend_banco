import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client successfully created' })
  @ApiResponse({ status: 409, description: 'DNI already exists' })
  create(@Body() createClientDto: CreateClientDto, @Request() req) {
    return this.clientsService.create(createClientDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'Return all clients' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({ status: 200, description: 'Return the client' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Get('dni/:dni')
  @ApiOperation({ summary: 'Get a client by DNI' })
  @ApiResponse({ status: 200, description: 'Return the client' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findByDni(@Param('dni') dni: string) {
    return this.clientsService.findByDni(dni);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'Client successfully updated' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Request() req) {
    return this.clientsService.update(id, updateClientDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 200, description: 'Client successfully deleted' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 400, description: 'Client has accounts with non-zero balances' })
  remove(@Param('id') id: string, @Request() req) {
    return this.clientsService.remove(id, req.user.id);
  }
}