import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/database/prisma.module.js';
import { RedisModule } from './core/redis/redis.module.js';
import configuration from './core/config/configuration.js';
import { envValidationSchema } from './core/config/env.validation.js';
import { AuthModule } from './features/auth/auth.module.js';
import { SettingsModule } from './features/settings/settings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    SettingsModule
  ],
})
export class AppModule {}