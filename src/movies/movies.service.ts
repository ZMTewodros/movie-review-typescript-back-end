import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from '../models/movie.model';
import { MovieCategory } from '../models/movie-category.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie) private movieModel: typeof Movie) {}

  async findAll(page: number, limit: number, categoryId?: string, search?: string) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    // Correctly include avgRating using a literal subquery
    const { rows, count } = await this.movieModel.findAndCountAll({
  where,
  limit,
  offset,
  include: [
    { model: MovieCategory, as: 'category' },
    { model: Review, as: 'reviews', attributes: [] } // for aggregation
  ],
  attributes: {
    include: [
      [this.movieModel.sequelize!.fn('COALESCE', this.movieModel.sequelize!.fn('AVG', this.movieModel.sequelize!.col('reviews.rating')), 0), 'avgRating']
    ]
  },
  group: ['Movie.id', 'category.id'],
  order: [['createdAt', 'DESC']],
  subQuery: false,
});


    const sanitizedMovies = rows.map(movie => {
      const plain = movie.get({ plain: true });
      return {
        ...plain,
        avgRating: Number(plain.avgRating || 0),
      };
    });

    return {
      movies: sanitizedMovies,
      totalPages: Math.ceil(Number(count) / limit),
      totalCount: Number(count),
    };
  }

  async findOne(id: number) {
    const movie = await this.movieModel.findByPk(id, {
      include: [
        { model: MovieCategory, as: 'category' },
        {
          model: Review,
          as: 'reviews',
          include: [{ model: User, attributes: ['name', 'id'] }],
        },
      ],
    });

    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);

    const plain = movie.get({ plain: true });
    const total = plain.reviews?.reduce((sum: number, r: any) => sum + Number(r.rating || 0), 0);
    const avg = plain.reviews && plain.reviews.length > 0 ? total / plain.reviews.length : 0;

    return {
      ...plain,
      avgRating: Number(avg),
    };
  }

  async update(id: number, data: any) {
    const movie = await this.movieModel.findByPk(id);
    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
    return movie.update(data);
  }

  async create(data: any) {
    const categoryId = data.categoryId || data.category_id;
    return this.movieModel.create({ ...data, categoryId });
  }

  async delete(id: number) {
    const movie = await this.movieModel.findByPk(id);
    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
    await movie.destroy();
    return { success: true };
  }
}
