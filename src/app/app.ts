import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import globalErrorHandler from "./util/globalErrorHandler.js";

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(authRoutes);
app.use("/courses", adminRoutes, studentRoutes);

app.use(globalErrorHandler);
const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mohmedhtem1:n8VW2xdnVTuYZUbt@coursesful-ts-db.fosxmpo.mongodb.net/?retryWrites=true&w=majority"
    );

    app.listen(8080);

    console.log("Client connected");
  } catch (err) {
    console.log(err);
  }
};
start();
