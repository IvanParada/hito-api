import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMaterialDto {
    @IsString()
    @MaxLength(150)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    code?: string;

    @IsString()
    @MaxLength(20)
    unit: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    supplierReference?: string;

    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @Min(0)
    costPrice: number;

    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @Min(0)
    salePrice: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}