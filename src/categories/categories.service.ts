import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MovieCategory } from '../models/movie-category.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(MovieCategory) private categoryModel: typeof MovieCategory,
  ) {}

  async findAll() {
    return this.categoryModel.findAll();
  }

  async findOne(id: number) {
    const cat = await this.categoryModel.findByPk(id);
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }
}