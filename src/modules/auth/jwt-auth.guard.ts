import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/common/decorater/public.decorater';

@Injectable()
export class JwtAuthGuard extends AuthGuard('protect') {
    constructor(private reflector: Reflector){
        super()
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);

          if (isPublic) {
            return true;
          }
          return super.canActivate(context);
        }
      
      handleRequest(err, user, info) {
        
        if(info instanceof TokenExpiredError) throw new ForbiddenException("Token hết hạn") 
        if(info instanceof JsonWebTokenError || !user) throw new UnauthorizedException("Không có Token hoặc Token không hợp lệ ") 
      
       
        return user;
      }
}
