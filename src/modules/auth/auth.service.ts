import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import loginDto from './dto/login.dto';
import registerDto from './dto/register.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type TUserExists = {
    pass_word: string;
    user_id: number;
}

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, public configService: ConfigService){}

    async login(loginDto: loginDto){
        const {email, pass_word} = loginDto
        const userExists = await this.prisma.users.findFirst({
            where: {
                email: email
            },
            select: {
                user_id: true,
                pass_word: true
            }

        })
        if(!userExists) throw new BadRequestException(`Email khong ton tai, vui long dang ky`)
        const isPassword = bcrypt.compareSync(pass_word, userExists.pass_word)
        if(!isPassword) throw new BadRequestException(`Sai mat khau`)

        const tokens = this.createTokens(userExists)

        return tokens
    };
    async register(registerDto: registerDto){
        const {email, pass_word, phone, user_name,account} = registerDto
        const userExists = await this.prisma.users.findFirst({
            where: {
                email: email,
            },
            select: {
                user_id: true,
                pass_word: true,
                phone: true,
                user_name: true,
                account: true
            }

        })
        if(userExists) throw new BadRequestException(`Email đã ton tai, vui long chọn email khác`)

        const hassPassword = bcrypt.hashSync(pass_word, 10)

        const userRegister = await this.prisma.users.create({
            data: {
                email: email,
                pass_word: hassPassword,
                phone: phone,
                user_name: user_name,
                role_id: 2,
                account: account
            }
        })

        return userRegister
    };
        createTokens(userExists: TUserExists){
            const accessToken = this.jwtService.sign({user_id: userExists.user_id}, {
                secret:this.configService.get<string>(`ACCESS_TOKEN_SECRET`), 
                expiresIn:this.configService.get<string>(`ACCESS_TOKEN_EXPIRES`)
            })
            const refreshToken = this.jwtService.sign({user_id: userExists.user_id}, {
                secret:this.configService.get<string>(`REFRESH_TOKEN_SECRET`),                                         
                expiresIn: this.configService.get<string>(`REFRESH_TOKEN_EXPIRES`)
            })
            return {accessToken,refreshToken}
        }
}
