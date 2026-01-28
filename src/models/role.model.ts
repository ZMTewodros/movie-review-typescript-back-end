import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'Roles' })
export class Role extends Model {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare name: string;

  @HasMany(() => User)
  declare users: User[];
}
