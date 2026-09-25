import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service.js";
import { UpdateSettingsDto } from "./dto/update-settings.dto.js";

@Injectable()
export class SettingsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getSettings(organizationId: string) {
        const settings = await this.prisma.companySetting.findUnique({
            where: { organizationId }
        });

        if (!settings)
            throw new NotFoundException('Organización no encontrada');

        return settings;
    }

    async updateSettings(organizationId: string, dto: UpdateSettingsDto) {
        const settings = await this.prisma.companySetting.findUnique({
            where: { organizationId }
        });

        if (!settings)
            throw new NotFoundException('Organización no encontrada');

        return this.prisma.companySetting.update({
            where: { organizationId },
            data: dto
        });
    }
}