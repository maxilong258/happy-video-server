import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map(data => {
        // console.log(req)
        // const logFormat = `
        //   Request original url: ${req.originalUrl}
        //   Method: ${req.method}
        //   IP: ${req.ip}
        //   User: ${JSON.stringify(req.user)}
        //   Response data: ${JSON.stringify(data)}
        //  `;
        return {
          success: true,
          message: 'success',
          data,  
        };
      }),
    );
  }
}