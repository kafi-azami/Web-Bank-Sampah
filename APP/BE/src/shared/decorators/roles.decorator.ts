import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('NASABAH' | 'ADMIN_BANK')[]) =>
  SetMetadata(ROLES_KEY, roles);