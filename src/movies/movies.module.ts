import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from '../models/movie.model';
import { MovieCategory } from '../models/movie-category.model';

@Module({
  imports: [SequelizeModule.forFeature([Movie, MovieCategory])],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}