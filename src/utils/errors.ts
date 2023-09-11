type HttpExceptionOptions = {
  res?: Response;
  message?: string;
};

export class HttpException extends Error {
  readonly res?: Response;
  readonly status: number;

  constructor(message: string, res?: Response) {
    super(message);
    this.res = res;
  }

  getResponse(): Response {
    if (this.res) {
      return this.res;
    }

    return Response.json(
      { success: false, message: this.message },
      { status: this.status }
    );
  }
}

export class NotFoundException extends HttpException {
  readonly status: number = 404;
}

export class BadRequestException extends HttpException {
  readonly status: number = 400;
}

export class UnauthorizedException extends HttpException {
  readonly status: number = 401;
}
