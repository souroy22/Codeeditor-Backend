import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";

interface IRoom extends Document {
  name: string;
  password: string;
  slug: string;
  code: string;
  onlineUsers: Types.ObjectId[];
  createdBy: Types.ObjectId;
}

const roomSchema = new mongoose.Schema<IRoom>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    code: {
      type: String,
      default: "",
    },
    onlineUsers: {
      type: [mongoose.Schema.ObjectId],
      ref: "User",
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

roomSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  return next();
});

const Room = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
