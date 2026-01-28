import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    private jwtService: JwtService
  ) {}

  async register(dto: any) {
    try {
      const hashed = await bcrypt.hash(dto.password, 10);
      const roleName = (dto.role || 'user').toLowerCase();
      
      const userRole = await this.roleModel.findOne({ where: { name: roleName } });
      if (!userRole) throw new BadRequestException(`Role '${roleName}' does not exist.`);

      const newUser = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        password: hashed,
        roleId: userRole.id 
      }); 
      
      return { message: "Registered successfully!", userId: newUser.id };
    } catch (error) {
      // Check terminal for these logs if registration fails
      console.error('--- REGISTRATION ERROR DETAILS ---');
      console.error(error); 
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException("Email already in use.");
      }
      
      throw new BadRequestException(`Registration failed: ${error.message}`);
    }
  }

  async login(email: string, password: string) {
  // Find user and explicitly include the Role
  const user = await this.userModel.findOne({
    where: { email },
    include: [{ model: Role }]
  });

  // If the user isn't found or the shadowed property is empty
  if (!user || !user.password) {
    console.log("User not found or password property is missing");
    throw new UnauthorizedException("Invalid credentials");
  }

  // Compare the raw password from the body with the hashed password from DB
  
  console.log('User password:', user.password);
  const valid = await bcrypt.compare(password, user.password);
  console.log('Password valid?', valid);
  
  if (!valid) {
    console.log("Bcrypt comparison failed");
    throw new UnauthorizedException("Invalid credentials");
  }

  const payload = { 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    role: user.role?.name || 'user' 
  };

  return {
    token: this.jwtService.sign(payload),
    user: payload
  };
}

  
}