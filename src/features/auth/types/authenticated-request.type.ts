import { OrganizationRole } from '@prisma/client';
import { Request } from 'express';
import { JwtPayload } from './jwt-payload.type.js';

export type OrganizationContext = {
  id: string;
  role: OrganizationRole;
};

export type AuthenticatedRequest = Request & {
  user: JwtPayload;
  organization?: OrganizationContext;
};