import { Body, Controller, Delete, Get, Post, Query, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ResponseMessage } from 'src/common/decorater/response-message.decorater';
import Schedule from './dto/schedule.dto';
import { Request } from 'express';
import BookTicket from './dto/bookticket.dto';
import { Public } from 'src/common/decorater/public.decorater';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get("getListBookingRoom")
  @Public()
  @ResponseMessage("Lấy danh sách phòng vé thành công")
  async getListBookingRoom(@Query(`idSchedule`) idSchedule: string,@Query(`idCinema`) idCinema: string){
    return await this.bookingService.getListBookingRoom(idSchedule,idCinema)
  }

  @Post("addSchedule")
  @ResponseMessage("Thêm lịch chiếu thành công")
  async addSchedule(@Body() schedule: Schedule){
    return await this.bookingService.addSchedule(schedule)
  }

  @Post("bookTicket")
  @ResponseMessage("Đặt vé thành công")
  async bookTicket(@Req() req:Request, @Body() bookTicket: BookTicket ){
    return await this.bookingService.bookTicket(req,bookTicket)
  }

  @Delete("cancelBooking")
  @ResponseMessage(`Hủy đặt vé thành công`)
  async cancelBooking(
    @Req() req: Request,
    @Query("schedule_id") schedule_id: string,
    @Query("seat_id") seat_id: string,
) {
    const result = await this.bookingService.cancelBooking(
        req,
        parseInt(schedule_id),
        parseInt(seat_id),
    );
    return result;
}
}
