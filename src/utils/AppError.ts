/**
 * Erro operacional conhecido (ex: 404, 400, 409).
 * Usado para diferenciar de erros inesperados (bugs) no errorHandler.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Recurso") {
    super(`${resource} não encontrado.`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Recurso já existe.") {
    super(message, 409);
  }
}
