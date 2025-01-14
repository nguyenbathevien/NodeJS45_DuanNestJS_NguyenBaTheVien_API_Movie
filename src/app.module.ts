import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';
import { CinemaModule } from './modules/cinema/cinema.module';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [AuthModule,ConfigModule.forRoot({isGlobal: true,}), UserModule, MovieModule, CinemaModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
