import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WithdrawalLimitsService } from './withdrawal-limits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Decimal } from '@prisma/client/runtime/library';

@Controller('withdrawal-limits')
export class WithdrawalLimitsController {
  constructor(private withdrawalLimitsService: WithdrawalLimitsService) {}

  @Get('account/:accountId')
  @UseGuards(JwtAuthGuard)
  async getDailyLimit(@Param('accountId') accountId: string) {
    try {
      const limit = await this.withdrawalLimitsService.getDailyWithdrawalLimit(
        accountId,
      );

      return {
        success: true,
        limit,
      };
    } catch (error) {
      throw new HttpException(
        'Error retrieving withdrawal limit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('account/:accountId/can-withdraw')
  @UseGuards(JwtAuthGuard)
  async canWithdraw(
    @Param('accountId') accountId: string,
    @Body() body: { amount: number },
  ) {
    try {
      const can = await this.withdrawalLimitsService.canWithdraw(
        accountId,
        new Decimal(body.amount),
      );

      return {
        success: true,
        canWithdraw: can,
      };
    } catch (error) {
      throw new HttpException(
        'Error checking withdrawal eligibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('account/:accountId/increment')
  @UseGuards(JwtAuthGuard)
  async incrementWithdrawalAmount(
    @Param('accountId') accountId: string,
    @Body() body: { amount: number },
  ) {
    try {
      const account =
        await this.withdrawalLimitsService.incrementDailyWithdrawalAmount(
          accountId,
          new Decimal(body.amount),
        );

      return {
        success: true,
        account,
      };
    } catch (error) {
      throw new HttpException(
        'Error incrementing withdrawal amount',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('account/:accountId/revert')
  @UseGuards(JwtAuthGuard)
  async revertWithdrawal(
    @Param('accountId') accountId: string,
    @Body() body: { amount: number },
  ) {
    try {
      const account = await this.withdrawalLimitsService.revertWithdrawal(
        accountId,
        new Decimal(body.amount),
      );

      return {
        success: true,
        message: 'Withdrawal reverted',
        account,
      };
    } catch (error) {
      throw new HttpException(
        'Error reverting withdrawal',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('account/:accountId/update-limit')
  @UseGuards(JwtAuthGuard)
  async updateLimit(
    @Param('accountId') accountId: string,
    @Body() body: { newLimit: number },
  ) {
    try {
      const account = await this.withdrawalLimitsService.updateDailyWithdrawalLimit(
        accountId,
        new Decimal(body.newLimit),
      );

      return {
        success: true,
        message: 'Withdrawal limit updated',
        account,
      };
    } catch (error) {
      throw new HttpException(
        'Error updating withdrawal limit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('account/:accountId/reset-daily-limit')
  @UseGuards(JwtAuthGuard)
  async resetDailyLimit(@Param('accountId') accountId: string) {
    try {
      await this.withdrawalLimitsService.resetDailyLimitIfNeeded(accountId);

      const limit = await this.withdrawalLimitsService.getDailyWithdrawalLimit(
        accountId,
      );

      return {
        success: true,
        message: 'Daily limit reset if needed',
        limit,
      };
    } catch (error) {
      throw new HttpException(
        'Error resetting daily limit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
