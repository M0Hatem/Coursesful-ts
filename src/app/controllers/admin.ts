import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { validationResult } from "express-validator";
import Course from "../models/course.js";

import { ValidationError } from "../classes/ValidationErrorClass.js";
import AddCourseFunction from "../services/CourseService.js";
import AddCourseRequest from "../services/models/AddCourseRequest";

const addCourse: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError("Validation failed.", 422, errors.array()));
  }
  try {
    const addCourseRequest = new AddCourseRequest(req.body.name);
    const course = await AddCourseFunction(req, addCourseRequest);
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
    maxStudents: req.body.maxStudents as Number,
    price: req.body.price as Number,
    instructorId: new ObjectId(req.userId),
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
    await Course.findByIdAndUpdate(courseId, { available: false });
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
