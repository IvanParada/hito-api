import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { LogoutDto } from './dto/logout.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from './types/authenticated-request.type.js';
import { OrganizationGuard } from './guards/organization.guard.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: LogoutDto): Promise<void> {
    await this.authService.logout(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(
      request.user.sub,
    );
  }

  @Get('organization-test')
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  organizationTest(@Req() request: AuthenticatedRequest) {
    return {
      userId: request.user.sub,
      organizationId: request.organization!.id,
      role: request.organization!.role,
    };
  }
}