import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsIn, IsInt, IsNumber, IsString, Matches } from "class-validator"

class createDto {
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
    @ApiProperty() 
    @IsInt({ message: `Role ID phải là số nguyên` }) 
    @IsIn([1, 2], { message: `Role ID chỉ được là 1 (admin) hoặc 2 (user)` })
    role_id: number;
}

export default createDto