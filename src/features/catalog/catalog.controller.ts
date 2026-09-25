import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { OrganizationGuard } from "../auth/guards/organization.guard.js";
import type { AuthenticatedRequest } from "../auth/types/authenticated-request.type.js";
import { CatalogService } from "./catalog.service.js";
import { CreateMaterialDto } from "./dto/create-material.dto.js";
import { UpdateMaterialDto } from "./dto/update-material.dto.js";

@Controller('catalog')
export class CatalogController {
    constructor(
        private readonly catalogService: CatalogService
    ) { }

    @Get('materials')
    @UseGuards(JwtAuthGuard, OrganizationGuard)
    getMaterials(
        @Req() request: AuthenticatedRequest,
    ) {
        return this.catalogService.getMaterials(
            request.organization!.id,
        );
    }

    @Get('materials/:id',)
    @UseGuards(JwtAuthGuard, OrganizationGuard)
    getMaterialById(
        @Req() request: AuthenticatedRequest,
        @Param('id') materialId: string
    ) {
        return this.catalogService.getMaterialById(
            request.organization!.id,
            materialId
        );
    }

    @Post('materials')
    @UseGuards(JwtAuthGuard, OrganizationGuard)
    createMaterial(
        @Req() request: AuthenticatedRequest,
        @Body() dto: CreateMaterialDto
    ) {
        return this.catalogService.createMaterial(
            request.organization!.id,
            dto
        )
    }

    @Patch('materials/:id')
    @UseGuards(JwtAuthGuard, OrganizationGuard)
    updateMaterials(
        @Req() request: AuthenticatedRequest,
        @Body() dto: UpdateMaterialDto,
        @Param('id') materialId: string

    ) {
        return this.catalogService.updateMaterial(
            request.organization!.id,
            materialId,
            dto

        )
    }

    @Delete('materials/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard, OrganizationGuard)
    async deleteMaterial(
        @Req() request: AuthenticatedRequest,
        @Param('id') materialId: string,
    ): Promise<void> {
        await this.catalogService.deleteMaterial(
            request.organization!.id,
            materialId,
        );
    }

}