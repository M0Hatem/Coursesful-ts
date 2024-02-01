import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  credit: {
    type: Number,
  },
  subscribedCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});
export default mongoose.model("User", UserSchema);
