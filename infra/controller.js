import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObect = new InternalServerError({
    cause: error,
  });
  console.error(publicErrorObect);
  response.status(publicErrorObect.statusCode).json(publicErrorObect);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
