import Course from "../models/course.js";
import AddCourseRequest from "./models/AddCourseRequest.js";

export default async function AddCourseFunction(
  req: any,
  request: AddCourseRequest
) {
  const maxStudents = req.body.maxStudents as Number;
  const price = req.body.price as Number;

  const course = new Course({
    name: request.name,
    maxStudents: maxStudents,
    price: price,
    instructorId: req.userId,
  });
  // console.log(course);
  await course.save();
  return course;
}
