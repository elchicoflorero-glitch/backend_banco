import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('LoggingInterceptor');

  intercept(context: ExecutionContext, next): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    // Solo registrar en modo debug o para ciertos endpoints importantes
    const isDebugMode = process.env.LOG_LEVEL === 'debug';
    const importantEndpoints = ['/auth/login', '/auth/register', '/transfers', '/accounts/create'];
    const shouldLog = isDebugMode || importantEndpoints.some(endpoint => url.includes(endpoint));

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        if (shouldLog) {
          this.logger.debug(
            `${method} ${url} - Completed in ${duration}ms`,
          );
        }
      }),
    );
  }
}
