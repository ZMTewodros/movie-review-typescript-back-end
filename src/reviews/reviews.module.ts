import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';
import { Movie } from '../models/movie.model';

@Module({
  imports: [SequelizeModule.forFeature([Review, User, Movie])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}