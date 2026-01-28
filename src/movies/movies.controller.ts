import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  getAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.moviesService.findOne(Number(id));
  }
}