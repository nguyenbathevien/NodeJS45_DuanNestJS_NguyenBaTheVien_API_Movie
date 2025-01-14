import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

// DTO cho từng vé trong danh sách
class Ticket {
  @ApiProperty({ description: "Mã ghế (<Mã lịch chiếu><vitri>)" })
  @IsInt({ message: "seat_id phải là một số nguyên" })
  seat_id: number;

  @ApiProperty({ description: "Giá vé cho ghế" })
  @IsNumber({}, { message: "ticket_price phải là một số" })
  ticket_price: number;
}

class BookTicket {
  @ApiProperty({ description: "Mã lịch chiếu" })
  @IsInt({ message: "schedule_id phải là một số nguyên" })
  schedule_id: number;

  @ApiProperty({
    description: "Danh sách vé",
    type: [Ticket], 
  })
  @IsArray({ message: "ListTicket phải là một mảng" })
  @ValidateNested({ each: true }) 
  @Type(() => Ticket) 
  listTicket: Ticket[];
}

export default BookTicket;
