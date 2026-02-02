import { Controller, Get, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.usersService.findOne(Number(id));
  }

  @Put('promote/:id')
  promote(@Param('id') id: number) {
    return this.usersService.promoteToAdmin(Number(id));
  }

  @Put('demote/:id')
  demote(@Param('id') id: number) {
    return this.usersService.demoteToUser(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser(Number(id));
  }
}
