import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { ValidationError } from "../classes/ValidationErrorClass.js";

export const isAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new ValidationError("Not authenticated.", 401);
    next(error);
  }
  const token = authHeader!.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "myVerySecretKeyO-o");
  } catch (err) {
    next(err);
  }
  if (!decodedToken) {
    const error = new ValidationError("Not authenticated.", 401);
    next(error);
  }
  if (typeof decodedToken === "object" && "userId" in decodedToken) {
    req.userId = decodedToken.userId;
  }
  next();
};
