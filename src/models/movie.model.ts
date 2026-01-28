import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { MovieCategory } from './movie-category.model';
import { Review } from './review.model';

@Table({ tableName: 'Movies' })
export class Movie extends Model {
  @Column({ type: DataType.STRING })
  title!: string;

  @Column({ type: DataType.STRING })
  author!: string;

  @Column({ type: DataType.STRING })
  director!: string;

  @Column({ type: DataType.INTEGER })
  year!: number;

  @Column({ type: DataType.STRING })
  image!: string;

  @ForeignKey(() => MovieCategory)
  @Column({ type: DataType.INTEGER })
  categoryId!: number;

  @BelongsTo(() => MovieCategory)
  category!: MovieCategory;

  @HasMany(() => Review)
  reviews!: Review[];
}