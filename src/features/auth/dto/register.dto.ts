import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { OrganizationType } from '@prisma/client';

export class RegisterDto {

    @IsString()
    @MaxLength(100)  
    name: string;

    @IsEmail()
    @MaxLength(100)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    password: string;

    @IsEnum(OrganizationType)
    organizationType: OrganizationType;

    @IsString()
    @MaxLength(100)
    organizationName: string;
}