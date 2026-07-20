import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FraudService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement fraud detection methods
}
