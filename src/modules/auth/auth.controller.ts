import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import loginDto from './dto/login.dto';
import registerDto from './dto/register.dto';
import { ResponseMessage } from 'src/common/decorater/response-message.decorater';
import { Public } from 'src/common/decorater/public.decorater';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post(`login`)
  @ResponseMessage(`Đăng nhập thành công`)
  login(@Body() loginDto: loginDto){
    return this.authService.login(loginDto)
  }
  @Public()
  @Post(`register`)
  @ResponseMessage(`Đăng ký thành công`)
  register(@Body() registerDto: registerDto){
    return this.authService.register(registerDto)
  }
}
