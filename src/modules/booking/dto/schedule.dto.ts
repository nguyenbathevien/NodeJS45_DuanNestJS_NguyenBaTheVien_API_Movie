import { ApiProperty, ApiQuery } from "@nestjs/swagger";
import { IsInt, IsNumber, IsDateString } from "class-validator";
import { Public } from "src/common/decorater/public.decorater";

class Schedule {
    @ApiProperty({example: 1})
    @IsNumber({}, { message: "movie_id phải là 1 số" })
    movie_id: number;

    @ApiProperty({example: "yyyy/mm/dd hh:mm:ss"})
    @IsDateString({}, { message: "Ngày giờ chiếu phải có dạng DateTime yyyy-mm-dd hh:mm:ss" })
    show_datetime: string;

    @ApiProperty({example: 1})
    @IsNumber({}, { message: "cinema_id phải là 1 số" })
    cinema_id: number;

    @ApiProperty({example: 1})
    @IsInt({ message: "Giá vé phải là 1 số nguyên" })
    ticket_price: number;
}

export default Schedule