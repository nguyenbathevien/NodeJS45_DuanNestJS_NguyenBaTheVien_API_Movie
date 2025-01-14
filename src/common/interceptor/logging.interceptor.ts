//https://docs.nestjs.com/interceptors
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    //Hiển thị lịch sử sử dụng api
    private readonly logger = new Logger()
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log(`Do SomeThing...`)

    const now = Date.now();
    return next
      .handle()
      .pipe();
  }
}
