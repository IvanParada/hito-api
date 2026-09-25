import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { SettingsService } from "./settings.service.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { OrganizationGuard } from "../auth/guards/organization.guard.js";
import type { AuthenticatedRequest } from "../auth/types/authenticated-request.type.js";
import { UpdateSettingsDto } from "./dto/update-settings.dto.js";

@Controller('settings')
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard, OrganizationGuard)
    getSettings(@Req() request: AuthenticatedRequest) {
        return this.settingsService.getSettings(request.organization!.id);
    }

    @Patch()
    @UseGuards(JwtAuthGuard, OrganizationGuard)
    updateSettings(
        @Req() request: AuthenticatedRequest,
        @Body() dto: UpdateSettingsDto
    ) {
        return this.settingsService.updateSettings(request.organization!.id, dto);
    }
}