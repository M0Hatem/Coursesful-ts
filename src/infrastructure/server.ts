import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import globalErrorHandler from "../util/globalErrorHandler";
import AdminRoutes from "../Presentation/Routes/AdminRoutes";
import StudentRoutes from "../Presentation/Routes/StudentRoutes";
import AuthRoutes from "../Presentation/Routes/AuthRoutes";

export function createServer() {
  const app = express();

  const authRoutes = new AuthRoutes().getRouter();
  const adminRoutes = new AdminRoutes().getRouter(); //TODO reuse the adminRoute
  const studentRoutes = new StudentRoutes().getRouter();

  app.use(bodyParser.json());
  app.use(cors());

  app.use(authRoutes);
  app.use("/courses", studentRoutes, adminRoutes);

  app.use(globalErrorHandler);

  return app;
}
