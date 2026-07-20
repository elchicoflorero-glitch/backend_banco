import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OTPService } from './otp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('otp')
export class OTPController {
  constructor(private otpService: OTPService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateOTP(@Body() body: { accountId: string; type: string }) {
    try {
      const otp = await this.otpService.createOTPRequest(
        body.accountId,
        body.type as 'withdrawal' | 'transfer' | 'account_unlock',
      );

      // No retornamos el código en la respuesta por seguridad
      // El código debería ser enviado por SMS/Email
      return {
        success: true,
        message: 'OTP generated and sent',
        otpId: otp.id,
      };
    } catch (error) {
      throw new HttpException(
        'Error generating OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validateOTP(
    @Body()
    body: { accountId: string; code: string; type: string },
  ) {
    try {
      const result = await this.otpService.validateOTP(
        body.accountId,
        body.code,
        body.type as 'withdrawal' | 'transfer' | 'account_unlock',
      );

      if (!result.valid) {
        const otpRequest = await this.otpService.getActiveOTPByAccountId(
          body.accountId,
          body.type,
        );

        if (otpRequest) {
          await this.otpService.incrementAttempts(otpRequest.id);
        }

        throw new HttpException(result.reason, HttpStatus.BAD_REQUEST);
      }

      // Si es válido, marcar como usado
      await this.otpService.markOTPAsUsed(result.otpRequest.id);

      return {
        success: true,
        message: 'OTP validated successfully',
        otpId: result.otpRequest.id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error validating OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('account/:accountId/active/:type')
  @UseGuards(JwtAuthGuard)
  async getActiveOTP(@Param('accountId') accountId: string, @Param('type') type: string) {
    try {
      const otp = await this.otpService.getActiveOTPByAccountId(
        accountId,
        type,
      );

      if (!otp) {
        throw new HttpException('No active OTP found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        otpId: otp.id,
        expiresAt: otp.expiresAt,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error retrieving OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
