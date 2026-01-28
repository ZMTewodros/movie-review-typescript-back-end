import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Role } from './role.model';
import { Review } from './review.model';

@Table({ tableName: 'Users' })
export class User extends Model {
  @Column(DataType.STRING)
  declare name: string;

  @Column({ type: DataType.STRING, unique: true })
  declare email: string;

  @Column(DataType.STRING)
  declare password: string;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  declare roleId: number;

  @BelongsTo(() => Role)
  declare role: Role;

  @HasMany(() => Review)
  declare reviews: Review[];
}
