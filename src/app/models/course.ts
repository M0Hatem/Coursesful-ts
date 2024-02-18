import mongoose, { Schema, SchemaType } from "mongoose";
import * as trace_events from "trace_events";

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
export default mongoose.model("Course", CourseSchema);
