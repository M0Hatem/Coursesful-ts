import { RequestHandler } from "express";

import Course from "../models/course.js";
import User from "../models/user.js";
import { match } from "node:assert";

const getCourses: RequestHandler = async (req, res, next) => {
  try {
    let allCourses = await Course.find({ available: true }).select([
      "-subscribedStudents",
    ]);
    const subscribedCourses = await User.findById(req.userId).populate({
      path: "subscribedCourses",
      match: { available: false },
      select: "-subscribedStudents",
    });
    let filtered = subscribedCourses!.subscribedCourses;

    // @ts-ignore
    allCourses = allCourses.concat(filtered);

    res.status(200).json({ courses: allCourses });
  } catch (e) {
    next(e);
  }
};
const getOneCourse: RequestHandler = async (req, res, next) => {
  const courseId = req.params.id;
  try {
    const course = await Course.find({
      _id: courseId,
      subscribedStudents: req.userId,
    }).select(["-subscribedStudents"]);
    if (!course) {
      res.status(404).json({ message: "course not found!" });
    }
    res.status(200).json({
      course: course[0],
    });
  } catch (e) {
    next(e);
  }
};
const getSubscribedCourses: RequestHandler = async (req, res, next) => {
  try {
    const userDoc = await User.findById(req.userId).populate(
      "subscribedCourses"
    );
    let subscribedCourses = userDoc!.subscribedCourses;
    res.status(200).json({
      subscribedCourses: subscribedCourses,
    });
  } catch (e) {
    next(e);
  }
};

const subscribeToCourse: RequestHandler = async (req, res, next) => {
  const courseId = req.params.id;
  try {
    const doc = await Course.findById(courseId);
    if (!doc) {
      return res.status(404).json({
        message: "course not found to subscribe.",
      });
    }
    const subscribed = await User.findOne({ subscribedCourses: doc._id });
    if (subscribed) {
      return res.status(409).json({ message: "already subscribed!" });
    }
    await User.findByIdAndUpdate(req.userId, {
      $push: { subscribedCourses: doc._id },
    });

    await Course.findByIdAndUpdate(doc._id, {
      $push: { subscribedStudents: req.userId },
    });
    res.status(201).json({ message: "successfully subscribed!" });
  } catch (e) {
    next(e);
  }
};

const unSubscribeToCourse: RequestHandler = async (req, res, next) => {
  const courseId = req.params.id;
  try {
    const doc = await Course.findById(courseId);
    if (!doc) {
      return res.status(404).json({
        message: "course not found to unSubscribe.",
      });
    }
    const subscribed = await User.findOne({
      _id: req.userId,
      subscribedCourses: doc._id,
    });
    if (!subscribed) {
      return res.status(409).json({ message: "not subscribe to this course" });
    }
    await User.findByIdAndUpdate(req.userId, {
      $pull: { subscribedCourses: doc._id },
    });
    await Course.findByIdAndUpdate(doc._id, {
      $pull: { subscribedStudents: req.userId },
    });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
export const studentControllers = {
  subscribeToCourse,
  unSubscribeToCourse,
  getCourses,
  getOneCourse,
  getSubscribedCourses,
};
