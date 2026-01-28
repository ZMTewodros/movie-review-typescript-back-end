import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseSeederService } from './db-seeder/seeder.service';
import { User } from './models/user.model';
import { Role } from './models/role.model';
import { Movie } from './models/movie.model';
import { MovieCategory } from './models/movie-category.model';
import { Review } from './models/review.model';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoriesModule } from './categories/categories.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    //  LOAD ENV FIRST
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //  SAFE DB CONNECTION
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'), // ✅ NOW STRING
        database: config.get<string>('DB_NAME'),
        models: [User, Role, Movie, MovieCategory, Review],
        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
    }),

    // FEATURE MODULES
    AuthModule,
    UsersModule,
    MoviesModule,
    ReviewsModule,
    CategoriesModule,
    AdminModule,
    SequelizeModule.forFeature([Role, MovieCategory]),
  ],
  providers: [DatabaseSeederService]
})
export class AppModule {}
