import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { validationResult } from "express-validator";

import User from "../models/user.js";
import Course from "../models/course.js";

import { ValidationError } from "../classes/ValidationErrorClass.js";

const addCourse: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError("Validation failed.", 422, errors.array()));
  }
  console.log(async () => {
    return Course.findById("65bb7d7b7c69090c2e2668ea").populate("instructorId");
  });
  const name = req.body.name as string;
  const instructorName = req.body.instructorName as string;
  const maxStudents = req.body.maxStudents as Number;
  const price = req.body.price as Number;

  const course = new Course({
    name: name,
    instructorName: instructorName,
    maxStudents: maxStudents,
    price: price,
    instructorId: req.userId,
  });
  console.log(course);
  try {
    await course.save();
    res.status(201).json({
      message: "course created successfully!",
      course: course,
    });
  } catch (err) {
    next(err);
  }
};

const updateCourse: RequestHandler = async (req, res, next) => {
  const courseId = req.params.id;

  const updatedCourse = {
    name: req.body.name as string,
    instructorName: req.body.instructorName as string,
    maxStudents: req.body.maxStudents as Number,
    price: req.body.price as Number,
  };
  try {
    const course = await Course.findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      updatedCourse
    );
    await course!.save();
    res.status(202).json({
      message: "the course updated successfully!",
      updatedCourse: updatedCourse,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteCourse: RequestHandler = async (req, res, next) => {
  const courseId = req.params.id;
  try {
    await Course.findByIdAndDelete(courseId);
    res.status(202).json({
      message: "course deleted successfully!",
    });
  } catch (err) {
    console.log(err);
  }
};
export const adminControllers = {
  addCourse,
  updateCourse,
  deleteCourse,
};
