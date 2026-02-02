import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException, 
  ConflictException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '../models/review.model'; 
import { User } from '../models/user.model';
import { Movie } from '../models/movie.model';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewModel: typeof Review,
    @InjectModel(Movie) private movieModel: typeof Movie,
  ) {}

  async create(data: any, userId: number) {
    if (!userId) throw new BadRequestException("User ID is required to create a review");
    const mId = Number(data.movie_id || data.movieId);

    const existingReview = await this.reviewModel.findOne({
      where: { userId, movieId: mId }
    });

    if (existingReview) throw new ConflictException("You already reviewed this movie.");

    try {
      const newReview = await this.reviewModel.create({
        rating: Number(data.rating),
        comment: data.comment,
        movieId: mId, 
        userId: userId,
      } as any);

      await this.updateMovieAverage(mId);
      return await this.findOne(newReview.id);
    } catch (error) {
      throw new InternalServerErrorException("Failed to create review");
    }
  }

  async findAll(page: number, limit: number, movieId?: number, userId?: number) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (movieId) where.movieId = movieId;
    if (userId) where.userId = userId;

    const { rows, count } = await this.reviewModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });

    return {
      reviews: rows,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
    };
  }

  async update(id: number, data: any, userId: number) {
    if (!userId) throw new ForbiddenException("Authentication required");

    const review = await this.reviewModel.findByPk(id);
    if (!review) throw new NotFoundException(`Review not found`);

    if (String(review.userId) !== String(userId)) {
        throw new ForbiddenException(`Ownership check failed. Owner: ${review.userId}, You: ${userId}`);
    }

    try {
      await review.update({
        rating: data.rating !== undefined ? Number(data.rating) : review.rating,
        comment: data.comment !== undefined ? data.comment.trim() : review.comment,
      });

      await this.updateMovieAverage(review.movieId);
      return await this.findOne(id);
    } catch (err) {
      throw new InternalServerErrorException("Database update failed");
    }
  }

  async remove(id: number, userId: number) {
    if (!userId) throw new ForbiddenException("Authentication required");

    const review = await this.reviewModel.findByPk(id);
    if (!review) throw new NotFoundException("Review not found");

    if (Number(review.userId) !== Number(userId)) {
      throw new ForbiddenException("Ownership verification failed");
    }
    
    const mId = review.movieId;
    try {
      await review.destroy();
      await this.updateMovieAverage(mId);
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException("Delete operation failed");
    }
  }

  private async updateMovieAverage(movieId: number) {
    const reviews = await this.reviewModel.findAll({ where: { movieId } });
    const avg = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length 
      : 0;

    await this.movieModel.update(
      { avgRating: Math.round(avg * 10) / 10 }, 
      { where: { id: movieId } }
    );
  }

  async findOne(id: number) {
    return await this.reviewModel.findByPk(id, {
      include: [{ model: User, attributes: ['name', 'id'] }]
    });
  }
}