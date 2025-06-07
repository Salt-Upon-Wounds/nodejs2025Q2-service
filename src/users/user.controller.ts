import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private userFormatter(user: User) {
    const { password, ...rest } = user;
    return {
      ...rest,
      createdAt: rest.createdAt.getTime(),
      updatedAt: rest.updatedAt.getTime(),
    };
  }

  @Get()
  async getAll() {
    const users = await this.userService.findAll();
    return users.map(this.userFormatter);
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.userService.findOne(id);
    return this.userFormatter(user);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return this.userFormatter(user);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    const user = await this.userService.updatePassword(id, dto);
    return this.userFormatter(user);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.userService.remove(id);
  }
}
