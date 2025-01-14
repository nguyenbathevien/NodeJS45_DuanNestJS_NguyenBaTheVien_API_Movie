//https://docs.nestjs.com/interceptors
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { responseSuccess } from '../helper/responese.helper';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE } from '../decorater/response-message.decorater';

@Injectable()
export class ResponseSuccessInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector){}    
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next
      .handle()
      .pipe(map((data) => {
        console.log({data})
        const message = this.reflector .getAllAndOverride<string>(RESPONSE_MESSAGE, [
          context.getHandler(),
          context.getClass(),
        ]);
        console.log({message})
        const result = responseSuccess(data,message)
        return result
       }));
  }
}
