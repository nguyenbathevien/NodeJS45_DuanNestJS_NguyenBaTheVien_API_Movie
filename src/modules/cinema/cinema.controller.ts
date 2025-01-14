import { Controller, Get, Query } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { ResponseMessage } from 'src/common/decorater/response-message.decorater';
import { ApiQuery } from '@nestjs/swagger';

@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}


  @Get("getInfoCinema")
  @ApiQuery({required:false, name:"idCinema"})
  @ResponseMessage("Lấy thông tin rạp thành công")
  async getInfoCinema(@Query("idCinema") idCinema: string){
    return  this.cinemaService.getInfoCinema(idCinema)
  }
  @Get("getInfoCinemaClusters")
  @ApiQuery({required:false, name:"idCinemaClusters"})
  @ResponseMessage("Lấy thông tin cụm rạp thành công")
  async getInfoCinemaClusters(@Query("idCinemaClusters") idCinemaClusters: string){
    return  this.cinemaService.getInfoCinemaClusters(idCinemaClusters)
  }

  @Get("getShowtimesByMovieId")
  @ResponseMessage("Lấy thông tin lịch chiếu của phim thành công")
  async getShowtimesByMovieId(@Query("movie_id") movieId: string) {
    return this.cinemaService.getShowtimesByMovieId(movieId);
  }

  @Get("getShowtimeCinemaSystem")
  @ResponseMessage("Lấy danh sách lịch chiếu phim của rạp thành công")
  async getShowtimeCinemaSystem(@Query("system_id") systemId: string) {
    return this.cinemaService.getShowtimeCinemaSystem(systemId);
  }

}

  