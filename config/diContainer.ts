import { container } from "tsyringe";
import UserController from "../src/Presentation/Controllers/UserController";
import UserAppServices from "../src/Application/Services/UserAppServices";
import CourseRepositoryImpl from "../src/infrastructure/Repositories/CourseRepositoryImpl";
import UserRepositoryImpl from "../src/infrastructure/Repositories/UserRepositoryImpl";
import AuthAppServices from "../src/Application/Services/AuthAppServices";
import { AdminAppServices } from "../src/Application/Services/AdminAppServices";
import AdminController from "../src/Presentation/Controllers/adminController";
import AuthController from "../src/Presentation/Controllers/AuthController";

container.register("UserController", {
  useClass: UserController,
});

container.register("AdminController", {
  useClass: AdminController,
});

container.register("AuthController", {
  useClass: AuthController,
});

container.register("UserService", {
  useClass: UserAppServices,
});

container.register("AuthService", {
  useClass: AuthAppServices,
});

container.register("AdminServices", {
  useClass: AdminAppServices,
});

container.register("CourseRepository", {
  useClass: CourseRepositoryImpl,
});

container.register("UserRepository", {
  useClass: UserRepositoryImpl,
});
