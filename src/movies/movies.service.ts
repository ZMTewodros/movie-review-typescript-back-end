import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from '../models/movie.model';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie) private movieModel: typeof Movie,
  ) {}

  async findAll() {
    return this.movieModel.findAll();
  }

  async findOne(id: number) {
    const movie = await this.movieModel.findByPk(id);
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  // Add create/update/delete as needed...
}