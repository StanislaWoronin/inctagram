import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';
import { TLoginView } from '../../apps/main-app/auth/view-model/login.view-model';

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TLoginView> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        response.header('Access-Control-Allow-Credentials', '*');
      }),
    );
  }
}
