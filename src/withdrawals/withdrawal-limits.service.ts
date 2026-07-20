import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WithdrawalLimitsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene el límite de retiro diario de una cuenta
   */
  async getDailyWithdrawalLimit(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return {
      dailyLimit: account.dailyWithdrawalLimit,
      dailyWithdrawn: account.dailyWithdrawnAmount,
      remainingLimit: new Decimal(account.dailyWithdrawalLimit).minus(
        account.dailyWithdrawnAmount,
      ),
      resetTime: account.lastWithdrawalReset,
    };
  }

  /**
   * Verifica si se puede hacer un retiro basado en el límite diario
   */
  async canWithdraw(accountId: string, amount: Decimal): Promise<boolean> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Verificar si el día ha cambiado para resetear el contador
    await this.resetDailyLimitIfNeeded(accountId);

    const remaining = new Decimal(account.dailyWithdrawalLimit).minus(
      account.dailyWithdrawnAmount,
    );

    return new Decimal(amount).lessThanOrEqualTo(remaining);
  }

  /**
   * Incrementa el monto de retiro diario
   */
  async incrementDailyWithdrawalAmount(
    accountId: string,
    amount: Decimal,
  ) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Resetear si es necesario
    await this.resetDailyLimitIfNeeded(accountId);

    const newAmount = new Decimal(account.dailyWithdrawnAmount).plus(amount);

    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        dailyWithdrawnAmount: newAmount,
      },
    });
  }

  /**
   * Resetea el límite diario si ha pasado 24 horas
   */
  async resetDailyLimitIfNeeded(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const now = new Date();
    const lastReset = new Date(account.lastWithdrawalReset);
    const hoursDiff = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
      await this.prisma.account.update({
        where: { id: accountId },
        data: {
          dailyWithdrawnAmount: 0,
          lastWithdrawalReset: now,
        },
      });
    }
  }

  /**
   * Actualiza el límite de retiro diario para una cuenta
   */
  async updateDailyWithdrawalLimit(
    accountId: string,
    newLimit: Decimal,
  ) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        dailyWithdrawalLimit: newLimit,
      },
    });
  }

  /**
   * Revierte un retiro del contador diario (en caso de cancelación)
   */
  async revertWithdrawal(accountId: string, amount: Decimal) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const newAmount = new Decimal(account.dailyWithdrawnAmount).minus(amount);
    const finalAmount = newAmount.lessThan(0) ? new Decimal(0) : newAmount;

    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        dailyWithdrawnAmount: finalAmount,
      },
    });
  }
}
