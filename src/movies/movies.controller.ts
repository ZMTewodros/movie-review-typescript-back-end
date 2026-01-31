import { Controller, Get, Post, Put, Delete, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  async getAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.moviesService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  // FIX: Added GET endpoint for a single movie
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new BadRequestException('ID must be a number');
  }
    return this.moviesService.findOne(Number(id));
  }

  @Post()
  async create(@Body() movieData: any) {
    return this.moviesService.create(movieData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() movieData: any) {
    return this.moviesService.update(Number(id), movieData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.moviesService.delete(Number(id));
  }
}