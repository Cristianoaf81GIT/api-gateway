import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LogginInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Antes...');
    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`Depois ... ${Date.now() - now}ms`)));
  }
}
