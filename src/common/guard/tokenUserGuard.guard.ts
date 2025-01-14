import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ACCESS_TOKEN_SECRET } from "../constant/app.constant";

@Injectable()
export class CheckTokenUser implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context)
    const request = context.switchToHttp().getRequest()
    const token = request.headers['token'] as string
    console.log(token)
    try {
      const decoded = this.jwtService.verify(token, { secret: ACCESS_TOKEN_SECRET })
      if (decoded) {
        return true;
      }
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

}