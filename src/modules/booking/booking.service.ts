    import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
    import { PrismaService } from 'src/common/prisma/prisma.service';
    import Schedule from './dto/schedule.dto';
    import BookTicket from './dto/bookticket.dto';
    import { Request } from 'express';

    @Injectable()
    export class BookingService {
        constructor(private prisma: PrismaService) {}

        async getListBookingRoom(idSchedule: string, idCinema: string) {
            
                const scheduleId = +idSchedule;
                
                const schedule = await this.prisma.schedules.findFirst({
                    where: { schedule_id: scheduleId, cinema_id: +idCinema },
                    select:{
                        Cinemas:{select:{cinema_id:true,cinema_name:true,CinemaClusters:{select:{cluster_address:true}}}},
                        Movies:{select:{movie_id:true,movie_name:true,rating:true}},
                        show_datetime:true
                    }
                });
        
                if (!schedule) {
                    throw new BadRequestException('Lịch chiếu không tồn tại.');
                }
                const cinema = await this.prisma.cinemas.findFirst({
                    where:{cinema_id:+idCinema},
                    select:{max_seats:true}
                })
                const existingSeats = await this.prisma.seats.findFirst({
                    where: { schedule_id: scheduleId, cinema_id: +idCinema },
                });
        
                if (!existingSeats) {
                    const seats = [];
                    const seatCount = cinema.max_seats
                    for (let i = 1; i <= seatCount; i++) {
                        seats.push({
                            seat_id: +(`${scheduleId}${i}`),
                            seat_name: `Ghế ${i}`,
                            seat_type: 'standard',
                            schedule_id: scheduleId,
                            cinema_id: +idCinema
                        });
                    }
        
                    await this.prisma.seats.createMany({
                        data: seats,
                    });
                }
        
                const seatsWithBookingInfo = await this.prisma.seats.findMany({
                    where: { schedule_id: scheduleId, cinema_id: +idCinema },
                    select: {
                        seat_id: true,
                        seat_name: true,
                        seat_type: true,
                        Bookings: {
                            where: {
                                schedule_id: scheduleId,
                            },
                            select: {
                                is_booked: true,
                                users:{
                                    select:{
                                        user_name:true
                                    }
                                }
                            },
                        },
                    },
                });
                
                return {
                    schedule_id: scheduleId,
                    schedule,
                    seats: seatsWithBookingInfo.map(seat => ({
                        ...seat,
                        is_booked: seat.Bookings.length > 0 ? seat.Bookings[0].is_booked : false,
                    })),
                };
                
        }
        async addSchedule(schedule: Schedule){
            const {movie_id,cinema_id,ticket_price,show_datetime} = schedule
            const exitsMovieID = await this.prisma.movies.findUnique({where:{movie_id: movie_id}})
            const exitsCinemaID = await this.prisma.cinemas.findUnique({where:{cinema_id:cinema_id}})
            const exitsSchedule = await this.prisma.schedules.findFirst({where:{movie_id: movie_id,cinema_id:cinema_id}})
            if(!exitsCinemaID || !exitsMovieID) throw new BadRequestException("Không tìm thấy id movie hoặc cinema")
            if(exitsSchedule) throw new BadRequestException("Lịch chiếu đã tồn tại")
            const newSchedule = await this.prisma.schedules.create({
                data: {
                    movie_id: movie_id,
                    cinema_id: cinema_id,
                    show_datetime: new Date(show_datetime),
                    ticket_price: +ticket_price
                }
            });

           await this.getListBookingRoom(newSchedule.schedule_id.toString(), cinema_id.toString());
            return newSchedule;
        }
        async bookTicket(req: Request, bookTicket: BookTicket) {
            if (!req.user) {
              throw new UnauthorizedException("Bạn cần đăng nhập để đặt vé");
            }
          
            const { listTicket, schedule_id } = bookTicket;
            
            const seatIds = listTicket.map(ticket => ticket.seat_id);


            const existingBookings = await this.prisma.bookings.findMany({
              where: {
                schedule_id,
                seat_id: { in: seatIds },
              },
            });
          
            if (existingBookings.length > 0) {
              throw new BadRequestException("Một số ghế đã được đặt");
            }
          
            const schedule = await this.prisma.schedules.findUnique({
              where: { schedule_id },
              select:{schedule_id: true,ticket_price: true,}
            });
          
            if (!schedule) {
              throw new BadRequestException("Lịch chiếu không tồn tại");
            }
          
            const availableSeats = await this.prisma.seats.findMany({
              where: {
                schedule_id,
                seat_id: { in: seatIds },
              },
            });
          
            if (availableSeats.length !== seatIds.length) {
              throw new BadRequestException("Một số ghế không tồn tại trong lịch chiếu");
            }
            
            const invalidTickets = listTicket.filter(ticket => ticket.ticket_price !== schedule.ticket_price);

            if (invalidTickets.length > 0) {
              throw new BadRequestException("Một số vé đặt sai giá tiền trong lịch chiếu");
            }       
            const currentDateUtc = new Date();
            
            const bookingData = listTicket.map(ticket => ({
              user_id: req.user["user_id"], 
              seat_id: ticket.seat_id,
              schedule_id,
              ticket_price: ticket.ticket_price,
              is_booked: true,
              booking_date: new Date(currentDateUtc.getTime() + (7 * 60 * 60 * 1000)),
            }));
          
            try {
              await this.prisma.bookings.createMany({
                data: bookingData,
              });
          
              return bookingData;
            } catch (error) {
              
              throw new InternalServerErrorException("Có lỗi xảy ra khi đặt vé",error);
            }
          }
          
        async cancelBooking(req: Request, schedule_id: number, seat_id: number) {
            if (!req.user) {
                throw new UnauthorizedException("Bạn cần đăng nhập để hủy đặt vé");
            }
        
            const userId = req.user["user_id"];
        
            const existingBooking = await this.prisma.bookings.findFirst({
                where: {
                    user_id: userId,
                    schedule_id,
                    seat_id,
                },
            });
        
            if (!existingBooking) {
                throw new BadRequestException("Không tìm thấy thông tin đặt vé hoặc vé này không thuộc về bạn");
            }
        
            try {
              return  await this.prisma.bookings.delete({
                    where: {
                        user_id_schedule_id_seat_id: {
                            user_id: userId,
                            schedule_id,
                            seat_id,
                        },
                    },
                });
               
            } catch (error) {
                throw new InternalServerErrorException("Có lỗi xảy ra khi hủy đặt vé", error);
            }
        }
          
        
    }
