import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

//Id errado ou outro tipo de erro de digitação
const handleCastErrorDB = (err: any) => {
  const message = `Campo inválido: ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//erro de duplicação de chave
const handleDuplicateFieldsDB = (err: any) => {
  const value = err.keyValue ? JSON.stringify(err.keyValue) : '';
  const message = `Valor duplicado para o campo: ${value}. Por favor, utilize outro valor!`;
  return new AppError(message, 400);
};

//erros de validação do Mongoose
const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Dados inválidos: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: any, req: Request, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    erro: err,
    mensagem: err.message,
    stack: err.stack,
  });
};

// Middleware de tratamento de erros principal
const errorController = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Tratamento de erros específicos no modo de desenvolvimento
  let error = { ...err };
  error.message = err.message;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

  sendErrorDev(error, req, res);
};

export default errorController;
