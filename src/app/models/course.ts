import mongoose, { Schema, SchemaType } from "mongoose";

const CourseSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
});
export default mongoose.model("Course", CourseSchema);
