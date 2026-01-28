import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Movie } from './movie.model';
import { User } from './user.model';

@Table
export class Review extends Model<Review> {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @ForeignKey(() => Movie)
  @Column
  movieId!: number;

  @Column({ type: DataType.INTEGER })
  rating!: number;

  @Column({ type: DataType.TEXT })
  comment!: string;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Movie)
  movie!: Movie;
}