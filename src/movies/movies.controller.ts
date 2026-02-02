import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getAll(
    @Query('page') page?: number, 
    @Query('limit') limit?: number,
    @Query('category_id') categoryId?: string, // Matches frontend
    @Query('search') search?: string          // Matches frontend
  ) {
    return this.moviesService.findAll(
      Number(page) || 1, 
      Number(limit) || 10, 
      categoryId, 
      search
    );
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Post()
  async create(@Body() movieData: any) {
    return this.moviesService.create(movieData);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() movieData: any) {
    return this.moviesService.update(id, movieData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.delete(id);
  }
}