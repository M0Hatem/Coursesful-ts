import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
};

export default globalErrorHandler;
