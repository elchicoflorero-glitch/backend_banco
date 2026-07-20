import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class OTPService {
  constructor(private prisma: PrismaService) {}

  /**
   * Genera un código OTP de 6 dígitos
   */
  private generateOTPCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Crea una solicitud de OTP
   */
  async createOTPRequest(
    accountId: string,
    type: 'withdrawal' | 'transfer' | 'account_unlock',
    expiryMinutes: number = 5,
  ) {
    const code = this.generateOTPCode();
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    return this.prisma.oTPRequest.create({
      data: {
        accountId,
        code,
        type,
        expiresAt,
      },
    });
  }

  /**
   * Valida el código OTP
   */
  async validateOTP(
    accountId: string,
    code: string,
    type: 'withdrawal' | 'transfer' | 'account_unlock',
  ) {
    const otpRequest = await this.prisma.oTPRequest.findFirst({
      where: {
        accountId,
        code,
        type,
        isUsed: false,
      },
    });

    if (!otpRequest) {
      return { valid: false, reason: 'OTP not found or already used' };
    }

    // Verificar si ha expirado
    if (new Date() > otpRequest.expiresAt) {
      return { valid: false, reason: 'OTP expired' };
    }

    // Verificar intentos fallidos
    if (otpRequest.attempts >= 3) {
      return { valid: false, reason: 'Too many attempts' };
    }

    return { valid: true, otpRequest };
  }

  /**
   * Marca el OTP como usado
   */
  async markOTPAsUsed(otpId: string) {
    return this.prisma.oTPRequest.update({
      where: { id: otpId },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });
  }

  /**
   * Incrementa el contador de intentos
   */
  async incrementAttempts(otpId: string) {
    return this.prisma.oTPRequest.update({
      where: { id: otpId },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Limpia OTPs expirados
   */
  async cleanExpiredOTPs() {
    return this.prisma.oTPRequest.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        isUsed: false,
      },
    });
  }

  /**
   * Obtiene un OTP activo para una cuenta
   */
  async getActiveOTPByAccountId(accountId: string, type: string) {
    return this.prisma.oTPRequest.findFirst({
      where: {
        accountId,
        type,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }
}
