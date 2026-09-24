import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Erros de validação do Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Dados inválidos.",
      issues: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  // Erros operacionais conhecidos (404, 409, etc.)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Violação de constraint única do Postgres (ex: nome duplicado)
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"
  ) {
    return res.status(409).json({
      status: "error",
      message: "Já existe um registro com esses dados (violação de unicidade).",
    });
  }

  // Violação de foreign key (ex: publisherId inexistente)
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23503"
  ) {
    return res.status(409).json({
      status: "error",
      message: "Referência inválida: verifique os IDs relacionados enviados.",
    });
  }

  // Qualquer outro erro não esperado
  console.error("💥 Erro inesperado:", err);
  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor.",
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    status: "error",
    message: `Rota ${req.method} ${req.originalUrl} não existe.`,
  });
}
