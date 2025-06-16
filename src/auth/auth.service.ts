import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../services/prisma.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(login: string, password: string) {
    if (!login || !password)
      throw new BadRequestException('No login or password');
    const exists = await this.prisma.user.findUnique({ where: { login } });
    if (exists) throw new BadRequestException('User already exists');
    const hash = await bcrypt.hash(
      password,
      Number(process.env.CRYPT_SALT) || 10,
    );
    const now = new Date();
    await this.prisma.user.create({
      data: {
        id: uuidv4(),
        login,
        password: hash,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
    });
    return { message: 'User created' };
  }

  async login(login: string, password: string) {
    if (!login || !password)
      throw new BadRequestException('No login or password');
    const user = await this.prisma.user.findUnique({ where: { login } });
    if (!user) throw new ForbiddenException('User not found');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new ForbiddenException('Password incorrect');
    const tokens = await this.generateTokens(user.id, user.login);
    return tokens;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('No refreshToken');
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const tokens = await this.generateTokens(payload.userId, payload.login);
      return tokens;
    } catch {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }

  async generateTokens(userId: string, login: string) {
    const payload = { userId, login };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
    });
    return { accessToken, refreshToken };
  }
}
