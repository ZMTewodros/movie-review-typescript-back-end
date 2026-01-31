import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from '../models/movie.model';
import { MovieCategory } from '../models/movie-category.model';
import { Review } from '../models/review.model'; 
import { User } from '../models/user.model';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie) private movieModel: typeof Movie,
  ) {}

  async findAll(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.movieModel.findAndCountAll({
      limit,
      offset,
      include: [MovieCategory],
      order: [['createdAt', 'DESC']],
    });
    
    return {
      movies: rows,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
    };
  }

  // FIX: Added findOne logic with deep inclusion
  async findOne(id: number) {
    if (isNaN(id)) {
    throw new BadRequestException('Invalid movie ID provided');
  }
    const movie = await this.movieModel.findByPk(id, {
      include: [
        { model: MovieCategory },
        { 
          model: Review, 
          include: [{ model: User, attributes: ['name'] }] 
        }
      ],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async create(data: any) {
    return this.movieModel.create({
      ...data,
      categoryId: data.category_id 
    });
  }

  async update(id: number, data: any) {
    const movie = await this.movieModel.findByPk(id);
    if (!movie) throw new NotFoundException('Movie not found');
    return movie.update({
      ...data,
      categoryId: data.category_id 
    });
  }

  async delete(id: number) {
    const movie = await this.movieModel.findByPk(id);
    if (!movie) throw new NotFoundException('Movie not found');
    await movie.destroy();
    return { success: true };
  }
}