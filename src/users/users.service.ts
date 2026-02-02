import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
  ) {}

  async findAll() {
    return this.userModel.findAll({ include: [Role] });
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id, { include: [Role] });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

async promoteToAdmin(id: number) {
  const user = await this.userModel.findByPk(id);
  if (!user) throw new NotFoundException('User not found');

  const adminRole = await this.roleModel.findOne({ where: { name: 'admin' } });
  if (!adminRole) throw new BadRequestException('Admin role not found');

  user.roleId = adminRole.id;
  await user.save();

  return this.findOne(id);
}

async demoteToUser(id: number) {
  const user = await this.userModel.findByPk(id);
  if (!user) throw new NotFoundException('User not found');

  const userRole = await this.roleModel.findOne({ where: { name: 'user' } });
  if (!userRole) throw new BadRequestException('User role not found');

  user.roleId = userRole.id;
  await user.save();

  return this.findOne(id);
}


  async deleteUser(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');

    await user.destroy();

    return { message: 'User deleted successfully' };
  }
}
