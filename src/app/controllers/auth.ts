import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/user.js";
import { ValidationError } from "../classes/ValidationErrorClass";

const signup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ValidationError("Validation failed.", 422, errors.array()));
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Registration successful." });
  } catch (err) {
    next(err);
  }
};
const login: RequestHandler = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Authentication,failed please check your email or password",
    });
  }
  try {
    const isEqual = await bcrypt.compare(password, user.password as string);
    if (!isEqual) {
      return res.status(401).json({
        status: "error",
        message: "Authentication,failed please check your email or password",
      });
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      "myVerySecretKeyO-o",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      status: "success",
      message: "Authentication successful.",
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

export const authController = {
  signup,
  login,
};
