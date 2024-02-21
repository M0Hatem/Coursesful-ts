import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import globalErrorHandler from "../util/globalErrorHandler";

export function createServer() {
  const app = express();

  app.use(bodyParser.json());

  app.use(cors());

  app.use(globalErrorHandler);

  return app;
}
