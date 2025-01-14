import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CinemaService {
  constructor(private readonly prisma: PrismaService) {}
    async getInfoCinema(idCinema: string){
      if(!idCinema) return await this.prisma.cinemaSystems.findMany()
        return await this.prisma.cinemaSystems.findFirst({where:{system_id: +idCinema}})
    }
    
    async getInfoCinemaClusters(idCinemaClusters: string){
      if(!idCinemaClusters) return await this.prisma.cinemaClusters.findMany()
        return await this.prisma.cinemaClusters.findMany({
            where:{system_id: +idCinemaClusters},
            include:{Cinemas:{select:{cinema_id: true, cinema_name: true}}}})
    }

    async getShowtimesByMovieId(movieId: string) {
        return this.prisma.schedules.findMany({
          where: { movie_id: +movieId },
          select: {
            show_datetime: true,
            ticket_price: true,
            Cinemas: {
              select: {
                cinema_id: true,
                cinema_name: true,
                CinemaClusters: {
                  select: {
                    cluster_id: true,
                    cluster_name: true,
                    cluster_address:true,
                    CinemaSystems: {
                      select: {system_id: true,system_name: true,},},
                  },
                },
              },
            },
            Movies:{
                select:{
                    movie_id: true,
                    movie_name: true,
                    movie_trailer:true,
                    movie_image: true,
                    description: true,
                    release_date: true,
                    is_coming_soon:true,
                    is_showing:true,
                    is_hot:true,
                    rating:true,
                    duration: true
                }
            }
          },
        });
      }

    async getShowtimeCinemaSystem(systemId: string) {
      try {
        return await this.prisma.cinemaSystems.findMany({
            where: { system_id: +systemId },
            select: {
              system_id: true,
              system_name: true,
              logo_url: true,
              CinemaClusters: {
                select: {
                  cluster_id: true,
                  cluster_name: true,
                  cluster_address: true,
                  Cinemas: {
                    select: {
                      cinema_id: true,
                      cinema_name: true,
                      max_seats: true,
                      Schedules: {
                        select: {
                          schedule_id: true,
                          show_datetime: true,
                          ticket_price: true,
                          Movies: {
                            select: {
                              movie_id: true,
                              movie_name: true,
                              movie_image: true,
                              movie_trailer: true,
                              is_hot:true,
                              is_coming_soon:true,
                              is_showing:true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          });
        } catch (error) {
          throw new Error("Không lấy được danh sách lịch chiếu");
        }
      }
      
}
