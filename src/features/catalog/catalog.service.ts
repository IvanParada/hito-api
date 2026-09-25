import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service.js";
import { CreateMaterialDto } from "./dto/create-material.dto.js";
import { UpdateMaterialDto } from "./dto/update-material.dto.js";

@Injectable()
export class CatalogService {
    constructor(
        private readonly prisma: PrismaService,

    ) { }

    async getMaterials(organizationId: string) {
        const materials = this.prisma.catalogItem.findMany({
            where: {
                organizationId,
                category: 'MATERIAL',
                isActive: true,
            },
            orderBy: {
                name: 'asc',
            }
        });

        if (!materials)
            throw new NotFoundException('No se encontraron resultados');

        return materials;
    }

    async getMaterialById(organizationId: string, materialId: string) {

        const material = this.prisma.catalogItem.findFirst({
            where: {
                id: materialId,
                organizationId,
                category: 'MATERIAL'
            }
        });

        if (!material)
            throw new NotFoundException('No se encontraron resultados');

        return material;

    }

    async createMaterial(organizationId: string, dto: CreateMaterialDto) {
        return this.prisma.catalogItem.create({
            data: {
                organizationId,
                name: dto.name.trim(),
                description: dto.description?.trim(),
                category: 'MATERIAL',
                code: dto.code?.trim(),
                unit: dto.unit.trim(),
                supplierReference: dto.supplierReference?.trim(),
                costPrice: dto.costPrice,
                salePrice: dto.salePrice,
                isActive: dto.isActive ?? true
            }
        });

    }

    async updateMaterial(
        organizationId: string,
        materialId: string,
        dto: UpdateMaterialDto
    ) {
        const material = await this.prisma.catalogItem.findFirst({
            where: {
                id: materialId,
                organizationId,
                category: 'MATERIAL'
            }
        });

        if (!material)
            throw new NotFoundException('Material no encontrado')

        return this.prisma.catalogItem.update({
            where: {
                id: materialId
            },
            data: dto
        })
    }

    async deleteMaterial(organizationId: string, materialId: string) {

        const material = await this.prisma.catalogItem.findFirst({
            where: {
                id: materialId,
                organizationId,
                category: 'MATERIAL'
            }
        });

        if (!material)
            throw new NotFoundException('Material no encontrado')


        await this.prisma.catalogItem.delete({
            where: {
                id: materialId
            }

        })
    }
}