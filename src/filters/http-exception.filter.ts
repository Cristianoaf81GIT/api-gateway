import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: HttpException | any =
      exception instanceof HttpException ? exception.getResponse() : exception;
    console.log(message);
    this.logger.error(
      `Http Status: ${status}, Error Message: ${JSON.stringify(message)}`,
    );

    this.logger.debug(`${JSON.stringify(exception)} excessao original`);

    if (message && message.stack) delete message.stack;
    if (message && message.info) delete message.info;

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
