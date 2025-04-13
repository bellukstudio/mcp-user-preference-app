import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseApiInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (data instanceof StreamableFile) {
                    return data as any;
                }

                const response = context.switchToHttp().getResponse<any>();
                const statusCode = response.statusCode;
                const message = (data as any)?.message;
                let dataResponse = data;

                return {
                    meta: {
                        code: statusCode,
                        status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
                        message: message ?? 'Successfully',
                    },
                    data: dataResponse,
                };
            }),
        );
    }
}
