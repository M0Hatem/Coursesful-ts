import mongoose, { Document, Schema } from "mongoose";
import User from "../../Domain/Entites/User";

interface UserDocument extends User, Document {
  _id: string;
}

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
export default mongoose.model<UserDocument>("User", UserSchema);
