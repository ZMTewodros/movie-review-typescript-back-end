import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../models/role.model';
import { MovieCategory } from '../models/movie-category.model';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(MovieCategory) private categoryModel: typeof MovieCategory,
  ) {}

  async onModuleInit() {
    this.logger.log('Checking database for initial data...');
    try {
      // 1. Seed Roles
      const rolesCount = await this.roleModel.count();
      if (rolesCount === 0) {
        await this.roleModel.bulkCreate([
          { name: 'admin' },
          { name: 'user' }
        ]);
        this.logger.log('✅ Roles seeded: admin, user');
      } else {
        this.logger.log(`Skipping Roles seed: ${rolesCount} roles already exist.`);
      }

      // 2. Seed Categories
      const catCount = await this.categoryModel.count();
      if (catCount === 0) {
        await this.categoryModel.bulkCreate([
          { category: 'Drama' },
          { category: 'Comedy' },
          { category: 'Historical' },
          { category: 'Romance' }
        ]);
        this.logger.log('✅ Categories seeded: Drama, Comedy, Historical, Romance');
      } else {
        this.logger.log(`Skipping Categories seed: ${catCount} categories already exist.`);
      }
    } catch (error) {
      this.logger.error('❌ Seeding error:', error.message);
    }
  }
}