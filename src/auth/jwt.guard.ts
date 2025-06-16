import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const PUBLIC_PATHS = [
  /^\/auth\/signup/,
  /^\/auth\/login/,
  /^\/auth\/refresh/,
  /^\/doc/,
  /^\/$/,
];

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const path = req.path || req.url;
    if (PUBLIC_PATHS.some((re) => re.test(path))) {
      return true;
    }
    return super.canActivate(context);
  }
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
