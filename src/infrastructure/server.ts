import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import globalErrorHandler from "../util/globalErrorHandler";
import AdminRoutes from "../Presentation/Routes/AdminRoutes";
import StudentRoutes from "../Presentation/Routes/StudentRoutes";

export function createServer() {
  const app = express();

  const adminRoutes = new AdminRoutes().getRouter();
  const studentRoutes = new StudentRoutes().getRouter();

  app.use(bodyParser.json());
  app.use(cors());

  app.use("/courses", adminRoutes, studentRoutes);

  app.use(globalErrorHandler);

  return app;
}
