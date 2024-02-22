// import { RequestHandler } from "express";
// import { ObjectId } from "mongodb";
// import { validationResult } from "express-validator";
//
// import CourseMongooseModel from "../../infrastructure/Models/CourseMongooseModel";
// import ValidationError from "../../types/ValidationError";
//
// const addCourse: RequestHandler = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(new ValidationError("Validation failed.", 422, errors.array()));
//   }
//   try {
//     const maxStudents = req.body.maxStudents as Number;
//     const price = req.body.price as Number;
//
//     const course = new Course({
//       name: req.body.name,
//       maxStudents: maxStudents,
//       price: price,
//       instructorId: req.userId,
//     });
//     console.log(course);
//     await course.save();
//     return res.status(201).json({
//       message: "course created successfully!",
//       course: course,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
//
// const updateCourse: RequestHandler = async (req, res, next) => {
//   const courseId = req.params.id;
//
//   const updatedCourse = {
//     name: req.body.name as string,
//     maxStudents: req.body.maxStudents as Number,
//     price: req.body.price as Number,
//     instructorId: new ObjectId(req.userId),
//   };
//   try {
//     const course = await Course.findOneAndUpdate(
//       { _id: new ObjectId(courseId) },
//       updatedCourse
//     );
//
//     await course!.save();
//     res.status(202).json({
//       message: "the course updated successfully!",
//       updatedCourse: updatedCourse,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
//
// const deleteCourse: RequestHandler = async (req, res, next) => {
//   const courseId = req.params.id;
//   try {
//     await Course.findByIdAndUpdate(courseId, { available: false });
//     res.status(202).json({
//       message: "course deleted successfully!",
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const adminControllers = {
//   addCourse,
//   updateCourse,
//   deleteCourse,
// };
