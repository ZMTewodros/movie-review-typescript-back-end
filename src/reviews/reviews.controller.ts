import { Controller, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  getAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.reviewsService.findOne(Number(id));
  }
}