import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload.type.js';
import { AuthenticatedRequest } from '../types/authenticated-request.type.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request =
            context.switchToHttp().getRequest<AuthenticatedRequest>();

        const token =
            this.extractTokenFromHeader(request);

        if (!token)
            throw new UnauthorizedException('Token de acceso requerido');


        try {
            const payload =
                await this.jwtService.verifyAsync<JwtPayload>(
                    token,
                    {
                        secret:
                            this.configService.getOrThrow<string>(
                                'jwt.accessSecret',
                            ),
                    },
                );

            request.user = payload;

            return true;
        } catch {
            throw new UnauthorizedException('Token de acceso inválido o expirado');
        }
    }

    private extractTokenFromHeader(
        request: Request,
    ): string | undefined {
        const [type, token] =
            request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}