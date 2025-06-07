import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { PrismaService } from '../services/prisma.service';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('Missing required fields');
    }

    const now = new Date();
    return this.prisma.user.create({
      data: {
        id: uuidv4(),
        login: dto.login,
        password: dto.password,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<User> {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id } });
  }
}
