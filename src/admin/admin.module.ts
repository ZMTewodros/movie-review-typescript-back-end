import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../models/user.model';
import { Movie } from '../models/movie.model';
import { Review } from '../models/review.model';

@Module({
  // Add the models here
  imports: [SequelizeModule.forFeature([User, Movie, Review])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}