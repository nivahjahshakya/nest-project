import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'auth/decorator/roles.decorator';
import { Role } from 'auth/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user|| !user.role || user.role.length === 0) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    const hasRole = user.role.some((role: Role) => requiredRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }
    return true;
  }
}
