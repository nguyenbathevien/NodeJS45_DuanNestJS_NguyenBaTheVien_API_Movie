import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNumber, IsString, Matches } from "class-validator"

class registerDto {
    @ApiProperty()
    @IsString({message: `Email phai la string`})
    @IsEmail({},{message: `Email khong hop le`})
    email: string
    @ApiProperty()
    @IsString({message: `Password phai la string`})
    pass_word: string
    @ApiProperty()
    @IsString({message: `User_name phải la string`})
    user_name: string
    @ApiProperty()
    @IsString({ message: `Số điện thoại phải là string` })
    @Matches(/^\d+$/, { message: `Số điện thoại chỉ được chứa các chữ số` })
    phone: string
    @ApiProperty()
    @IsString({message: `Tài khoản phai la string`})
    account: string
}

export default registerDto