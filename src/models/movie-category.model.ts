import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Movie } from './movie.model';

@Table({ tableName: 'MovieCategories' })
export class MovieCategory extends Model {
  @Column({ 
    type: DataType.STRING, 
    unique: true,
    allowNull: false 
  })
  category!: string;

  @HasMany(() => Movie)
  movies!: Movie[];
} 