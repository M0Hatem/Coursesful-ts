import { container } from "tsyringe";
import UserController from "../Presentation/Controllers/UserController";
import UserAppServices from "../Application/Services/UserAppServices";
import CourseRepositoryImpl from "../infrastructure/Repositories/CourseRepositoryImpl";
import UserRepositoryImpl from "../infrastructure/Repositories/UserRepositoryImpl";
import AuthAppServices from "../Application/Services/AuthAppServices";
import { AdminAppServices } from "../Application/Services/AdminAppServices";
import AdminController from "../Presentation/Controllers/adminController";
import AuthController from "../Presentation/Controllers/AuthController";

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
