import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '../models/review.model';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewModel: typeof Review,
  ) {}

  async findAll() {
    return this.reviewModel.findAll();
  }

  async findOne(id: number) {
    const review = await this.reviewModel.findByPk(id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  // Add create/update/delete as needed...
}