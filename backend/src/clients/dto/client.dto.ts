import { ApiProperty } from '@nestjs/swagger';

export class ClientDto {
  @ApiProperty({ example: 'cuid-id-here', description: 'Client unique identifier' })
  id: string;

  @ApiProperty({ example: '12345678', description: 'Client DNI (unique)' })
  dni: string;

  @ApiProperty({ example: 'Juan', description: 'Client first name' })
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Client last name' })
  lastName: string;

  @ApiProperty({ example: 'juan.perez@email.com', description: 'Client email' })
  email: string;

  @ApiProperty({ example: '+51987654321', description: 'Client phone number' })
  phone: string;

  @ApiProperty({ example: '2025-06-17T09:21:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-17T09:21:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}
