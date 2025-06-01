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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = { ...this.userService.findOne(id) };
    delete user.password;
    return user;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    const user = { ...this.userService.create(dto) };
    delete user.password;
    return user;
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    const user = { ...this.userService.updatePassword(id, dto) };
    delete user.password;
    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    this.userService.remove(id);
  }
}
