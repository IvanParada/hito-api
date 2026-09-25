import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { OrganizationGuard } from './guards/organization.guard.js';

@Module({
  imports: [PrismaModule, JwtModule.register({}),],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, OrganizationGuard],
  exports: [JwtModule, JwtAuthGuard, OrganizationGuard]
})
export class AuthModule { }