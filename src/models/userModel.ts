import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";

export type JOINED_ROOMS_TYPE = {
  room: Types.ObjectId;
  pinned: boolean;
};

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  joinedRooms: JOINED_ROOMS_TYPE[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String || null,
      default: null,
    },
    joinedRooms: {
      type: [
        {
          room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
          },
          pinned: Boolean,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
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

const User = mongoose.model<IUser>("User", userSchema);

export default User;
