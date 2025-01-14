import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsBoolean, IsInt, IsDate, IsNumber } from "class-validator";

export class MovieDto {
    @ApiProperty({ description: "Tên của bộ phim", example: "Inception" })
    @IsString({ message: "Tên movie phải là dạng chuỗi" })
    movie_name: string;

    @ApiProperty({ description: "Trailer của bộ phim", example: "https://example.com/trailer" })
    @IsString({ message: "Trailer phải là dạng chuỗi" })
    movie_trailer: string;

    @ApiProperty({ description: "Mô tả về bộ phim", example: "Một bộ phim về hành trình trong giấc mơ." })
    @IsString({ message: "Mô tả phải là dạng chuỗi" })
    description: string;

    @ApiProperty({ description: "Ngày phát hành của bộ phim", example: "2025-01-04" })
    @Type(() => Date) // Chuyển chuỗi thành Date
    @IsDate({ message: "Ngày phát hành phải là dạng ngày hợp lệ" })
    release_date: Date;

    @ApiProperty({ description: "Đánh giá của bộ phim", example: 8 })
    @IsNumber({}, { message: "Đánh giá phải là số" })
    rating: number;

    @ApiProperty({ description: "Phim có hot không", example: true })
    @IsBoolean({ message: "Trạng thái hot phải là true hoặc false" })
    is_hot: boolean;

    @ApiProperty({ description: "Phim có đang chiếu không", example: false })
    @IsBoolean({ message: "Trạng thái đang chiếu phải là true hoặc false" })
    is_showing: boolean;

    @ApiProperty({ description: "Phim có sắp chiếu không", example: true })
    @IsBoolean({ message: "Trạng thái sắp chiếu phải là true hoặc false" })
    is_coming_soon: boolean;
}
