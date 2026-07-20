import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin', 'manager'] })
  role?: string | { name: string };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
