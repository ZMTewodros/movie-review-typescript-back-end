import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getAll(
    @Query('page') page?: string, 
    @Query('limit') limit?: string,
    @Query('movie_id') movieId?: string,
    @Query('user_id') userId?: string
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const movieIdNumber = movieId ? parseInt(movieId, 10) : undefined;
    const userIdNumber = userId ? parseInt(userId, 10) : undefined;

    return this.reviewsService.findAll(pageNumber, limitNumber, movieIdNumber, userIdNumber);
  }

  @Post()
  async create(@Body() reviewData: any) {
    const userId = reviewData.user_id || reviewData.userId; 
    return this.reviewsService.create(reviewData, userId);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() reviewData: any,
    @Req() req: any
  ) {
    // FIX: Look for userId in req.user (if Guard exists) OR the body (fallback)
    const userId = req.user?.id || reviewData.userId || reviewData.user_id; 
    
    return this.reviewsService.update(id, reviewData, userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    // FIX: For Delete, sometimes we pass userId in the body or headers
    const userId = req.user?.id || body.userId || body.user_id;
    
    return this.reviewsService.remove(id, userId);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }
}