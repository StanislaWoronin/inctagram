import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorResponse = { errors: exception };
    if (exception.message == 'Unauthorized') {
      response.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    if (exception.name === 'BadRequestException') {
      const [field, message] = exception.message.split(':');
      // @ts-ignore
      errorResponse.errors = [
        {
          message,
          field,
        },
      ];
    }
    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    return;
  }
}
