import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { AuthenticatedRequest } from '../types/authenticated-request.type.js';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const organizationId =
      request.headers['x-organization-id'];

    if (
      typeof organizationId !== 'string' ||
      !isUUID(organizationId)
    ) {
      throw new BadRequestException(
        'X-Organization-Id inválido',
      );
    }

    const membership =
      await this.prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: request.user.sub,
            organizationId,
          },
        },
        include: {
          organization: true,
        },
      });

    if (
      !membership ||
      !membership.isActive ||
      !membership.organization.isActive
    ) {
      throw new ForbiddenException(
        'No tienes acceso a esta organización',
      );
    }

    request.organization = {
      id: organizationId,
      role: membership.role,
    };

    return true;
  }
}