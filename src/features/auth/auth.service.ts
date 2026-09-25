import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service.js";
import { RegisterDto } from "./dto/register.dto.js";

import * as argon2 from 'argon2';
import { randomBytes, randomUUID } from 'node:crypto';
import { LoginDto } from "./dto/login.dto.js";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RefreshTokenDto } from "./dto/refresh-token.dto.js";
import { LogoutDto } from "./dto/logout.dto.js";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        const email = dto.email.trim().toLocaleLowerCase();

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });

        if (existingUser)
            throw new ConflictException('Ya existe una cuenta asociada a este correo');

        const passwordHash = await argon2.hash(dto.password);
        const slug = this.generateOrganizationSlug(dto.organizationName);

        return this.prisma.$transaction(async (tx) => {

            const user = await tx.user.create({
                data: {
                    name: dto.name.trim(),
                    email,
                    passwordHash,
                },
            });

            const organization = await tx.organization.create({
                data: {
                    name: dto.organizationName.trim(),
                    slug,
                    type: dto.organizationType,
                },
            });

            await tx.membership.create({
                data: {
                    userId: user.id,
                    organizationId: organization.id,
                    role: 'OWNER',
                },
            });

            await tx.companySetting.create({
                data: {
                    organizationId: organization.id,
                    tradeName: organization.name,
                },
            });

            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                organization: {
                    id: organization.id,
                    name: organization.name,
                    slug: organization.slug,
                    type: organization.type
                }
            }


        })



    }

    async login(dto: LoginDto) {
        const email = dto.email.trim().toLowerCase();

        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.isActive)
            throw new UnauthorizedException('Credenciales inválidas');

        const passwordValid = await argon2.verify(
            user.passwordHash,
            dto.password,
        );

        if (!passwordValid)
            throw new UnauthorizedException('Credenciales inválidas');

        const sessionId = randomUUID();

        const refreshTokenSecret = randomBytes(64).toString('hex');

        const refreshTokenHash = await argon2.hash(refreshTokenSecret);

        const refreshDays = this.configService.getOrThrow<number>('auth.refreshTokenExpiresDays');

        const expiresAt = new Date();

        expiresAt.setDate(
            expiresAt.getDate() + refreshDays
        );

        const session = await this.prisma.session.create({
            data: {
                id: sessionId,
                userId: user.id,
                refreshTokenHash,
                expiresAt,
            },
        });

        const refreshToken =
            `${session.id}.${refreshTokenSecret}`;

        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                sid: session.id,
            },
            {
                secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
                expiresIn: this.configService.getOrThrow<number>('jwt.accessExpiresIn'),
            }
        );

        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                lastLoginAt: new Date(),
            },
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        };

    }

    async refresh(dto: RefreshTokenDto) {
        const [sessionId, refreshTokenSecret] =
            dto.refreshToken.split('.');

        if (!sessionId || !refreshTokenSecret) {
            throw new UnauthorizedException(
                'Refresh token inválido',
            );
        }

        const session = await this.prisma.session.findUnique({
            where: {
                id: sessionId,
            },
            include: {
                user: true,
            },
        });

        if (!session || session.revokedAt || session.expiresAt <= new Date() || !session.user.isActive)
            throw new UnauthorizedException('Sesión inválida o expirada');


        const tokenValid = await argon2.verify(
            session.refreshTokenHash,
            refreshTokenSecret,
        );

        if (!tokenValid)
            throw new UnauthorizedException('Refresh token inválido');

        const newRefreshTokenSecret = randomBytes(64).toString('hex');

        const newRefreshTokenHash = await argon2.hash(newRefreshTokenSecret);

        await this.prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                refreshTokenHash: newRefreshTokenHash,
                lastUsedAt: new Date(),
            },
        });

        const accessToken =
            await this.jwtService.signAsync(
                {
                    sub: session.user.id,
                    sid: session.id,
                },
                {
                    secret:
                        this.configService.getOrThrow<string>(
                            'jwt.accessSecret',
                        ),

                    expiresIn:
                        this.configService.getOrThrow<number>(
                            'jwt.accessExpiresIn',
                        ),
                },
            );

        return {
            accessToken,

            refreshToken:
                `${session.id}.${newRefreshTokenSecret}`,
        };
    }

    async logout(dto: LogoutDto): Promise<void> {
        const [sessionId, refreshTokenSecret] = dto.refreshToken.split('.');

        if (!sessionId || !refreshTokenSecret)
            throw new UnauthorizedException('Refresh token inválido');

        const session = await this.prisma.session.findUnique({
            where: {
                id: sessionId,
            },
        });

        if (!session || session.revokedAt)
            throw new UnauthorizedException('Sesión inválida');

        const tokenValid = await argon2.verify(
            session.refreshTokenHash,
            refreshTokenSecret,
        );

        if (!tokenValid)
            throw new UnauthorizedException('Refresh token inválido');

        await this.prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }

    async me(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                memberships: {
                    where: {
                        isActive: true,
                        organization: {
                            isActive: true,
                        },
                    },
                    select: {
                        role: true,
                        organization: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user || !user.isActive)
            throw new UnauthorizedException('Usuario inválido');

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            memberships: user.memberships,
        };
    }

    private generateOrganizationSlug(name: string): string {
        const normalizedName = name
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return `${normalizedName}-${randomUUID().slice(0, 8)}`;
    }

}