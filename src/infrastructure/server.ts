import "dotenv/config";
import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { container } from "tsyringe";

import globalErrorHandler from "../util/globalErrorHandler";
import AdminRoutes from "../Presentation/Routes/AdminRoutes";
import StudentRoutes from "../Presentation/Routes/StudentRoutes";
import AuthRoutes from "../Presentation/Routes/AuthRoutes";
import UserController from "../Presentation/Controllers/UserController";
import AdminController from "../Presentation/Controllers/adminController";
import AuthController from "../Presentation/Controllers/AuthController";
import "../config/diContainer";

export function createServer() {
  const app = express();

  const userController = container.resolve<UserController>("UserController");
  const adminController = container.resolve<AdminController>("AdminController");
  const authController = container.resolve<AuthController>("AuthController");

  const authRoutes = new AuthRoutes(authController).getRouter();
  const adminRoutes = new AdminRoutes(adminController).getRouter();
  const studentRoutes = new StudentRoutes(userController).getRouter();

  app.use(bodyParser.json());
  app.use(cors());

  app.use(authRoutes);
  app.use("/courses", studentRoutes, adminRoutes);

  app.use(globalErrorHandler);
  return app;
}
