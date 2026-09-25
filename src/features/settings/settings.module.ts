import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/database/prisma.module.js";
import { SettingsController } from "./settings.controller.js";
import { AuthModule } from "../auth/auth.module.js";
import { SettingsService } from "./settings.service.js";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: []
})
export class SettingsModule {}