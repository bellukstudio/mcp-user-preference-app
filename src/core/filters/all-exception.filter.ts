import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseExceptionFilter } from "@nestjs/core";
import type { FastifyReply } from "fastify";

type ErrorResponse = {
    meta: any;
    data?: any;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
    constructor(private readonly configService: ConfigService) {
        super();
    }

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const { httpAdapter } = this.httpAdapterHost!;

        response.header("Content-Type", "application/json");

        let errorResponse: ErrorResponse;

        if (exception instanceof HttpException) {
            errorResponse = this._handleHttpException(exception, host);
        } else {
            errorResponse = this._handleInternalException(exception, host);
        }

        httpAdapter.reply(response, errorResponse, errorResponse.meta.statusCode);
    }

    private _handleHttpException(exception: HttpException, _host: ArgumentsHost): ErrorResponse {
        const exceptionStatusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse() as Record<string, any>;

        let errors = exceptionResponse?.errors ?? exceptionResponse?.error ?? null
        const metadata = {
            code: exceptionStatusCode,
            status: "error",
            message: exceptionResponse.message,
        }

        errors = !errors ? [metadata.message] : Array.isArray(errors) ? errors : [errors]

        if (exception instanceof ServiceUnavailableException) {
            metadata.message = "Service unavailable"
        }

        return { meta: metadata, data: { message: metadata.message } };
    }

    private _handleInternalException(exception: Error | any, _host: ArgumentsHost): ErrorResponse {
        const exceptionStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        const isProduction = this.configService.get<string>("NODE_ENV") === "production";

        this.logger.error("[500] Internal server error", exception.stack);

        const metadata = {
            code: exceptionStatusCode,
            status: "error",
            message: isProduction ? "Internal server error" : exception.message,
        };

        return { data: { message: metadata.message }, meta: metadata };
    }
}
