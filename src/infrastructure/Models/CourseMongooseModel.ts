import mongoose, { Document, Schema } from "mongoose";
import Course from "../../Domain/Entites/Course";

interface CourseDocument extends Course, Document {}

const CourseSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  maxStudents: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  subscribedStudents: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
export default mongoose.model<CourseDocument>("Course", CourseSchema);
