import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

class loginDto {
    @ApiProperty()
    @IsString({message: `Email phai la string`})
    @IsEmail({},{message: `Email khong hop le`})
    email: string
    @ApiProperty()
    @IsString({message: `Password phai la string`})
    pass_word: string
    
}

export default loginDto