import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Movie } from '../models/movie.model';
import { Review } from '../models/review.model';
import { Role } from '../models/role.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Movie) private movieModel: typeof Movie,
    @InjectModel(Review) private reviewModel: typeof Review,
  ) {}

  async getStats() {
    const [userCount, movieCount, reviewCount] = await Promise.all([
      this.userModel.count(),
      this.movieModel.count(),
      this.reviewModel.count(),
    ]);

    const recentUsers = await this.userModel.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Role }], // Ensure Role model is associated in User model
    });

    const movies = await this.movieModel.findAll({
      attributes: ['id', 'title', 'avgRating'],
      limit: 10,
      order: [['avgRating', 'DESC']],
    });

    return {
      counts: {
        users: userCount,
        movies: movieCount,
        reviews: reviewCount,
      },
      recentUsers,
      movies,
    };
  }
}