import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './user.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { DB } from 'src/db';

@Injectable()
export class UserService {
  private users: User[] = DB.users;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  create(dto: CreateUserDto): User {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('Missing required fields');
    }

    const now = Date.now();
    const newUser: User = {
      id: uuidv4(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(newUser);
    return newUser;
  }

  updatePassword(id: string, dto: UpdatePasswordDto): User {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = dto.newPassword;
    user.version++;
    user.updatedAt = Date.now();
    return user;
  }

  remove(id: string): void {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');

    this.users.splice(index, 1);
  }
}
