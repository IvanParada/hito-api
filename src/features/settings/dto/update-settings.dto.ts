import { Type } from 'class-transformer';
import {
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class UpdateSettingsDto {
    @IsOptional()
    @IsString()
    @MaxLength(150)
    tradeName?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    legalName?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    taxId?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    businessLine?: string | null;

    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    contactEmail?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    phone?: string | null;

    @IsOptional()
    @IsUrl({
        require_protocol: true,
    })
    @MaxLength(255)
    website?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    address?: string | null;

    @IsOptional()
    @IsUrl({
        require_protocol: true,
    })
    @MaxLength(500)
    logoUrl?: string | null;

    @IsOptional()
    @Matches(/^#[0-9A-Fa-f]{6}$/, {
        message: 'primaryColor debe tener formato hexadecimal, por ejemplo #2563EB',
    })
    primaryColor?: string | null;

    @IsOptional()
    @Matches(/^#[0-9A-Fa-f]{6}$/, {
        message: 'secondaryColor debe tener formato hexadecimal, por ejemplo #FFFFFF',
    })
    secondaryColor?: string | null;

    @IsOptional()
    @IsString()
    @Matches(/^[A-Z]{3}$/, {
        message: 'currencyCode debe tener formato ISO de 3 letras, por ejemplo CLP',
    })
    currencyCode?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    currencySymbol?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @Min(0)
    @Max(100)
    taxPercentage?: number;
}