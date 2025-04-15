import { CallHandler, ExecutionContext, Injectable, Response, StreamableFile, type NestInterceptor } from "@nestjs/common"
import { Observable, map } from "rxjs"
import { buildSuccessResponse } from "./build-success-response"

export type Response<T = any> = {
    data: T | null
    meta: {
        status: string
        code: number
        message: string
    }
}

@Injectable()
export class ResponseTransformInterceptor<T = any> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> | Promise<Observable<Response<T>>> {
        return next.handle().pipe(
            map((data) => {
                if (data instanceof StreamableFile) {
                    return data as any
                }
                const response = context.switchToHttp().getResponse<any>()
                return buildSuccessResponse(response.statusCode, data)
            }),
        )
    }
}
