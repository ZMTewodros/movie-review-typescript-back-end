import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Movie } from './movie.model';
import { User } from './user.model';

@Table({ tableName: 'reviews', underscored: true })
export class Review extends Model<Review> {
  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.INTEGER }) 
  userId!: number;

  @ForeignKey(() => Movie)
  @Column({ field: 'movie_id', type: DataType.INTEGER }) 
  movieId!: number;

  @Column({ type: DataType.INTEGER })
  rating!: number;

  @Column({ type: DataType.TEXT })
  comment!: string;

  @BelongsTo(() => User)
  User!: User;

  @BelongsTo(() => Movie)
  movie!: Movie;
}