import { Request, Response } from "express";
import User from "../models/userModel";

const userControllers = {
  getUserData: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user.user.id, {
        name: 1,
        email: 1,
        avatar: 1,
        joinedRooms: 1,
        _id: 0,
      }).populate({
        path: "joinedRooms.room",
        select: "name slug createdBy -_id",
        populate: { path: "createdBy", select: "name -_id" },
      });
      if (!user) {
        return res.status(400).json({ error: "No such user found!" });
      }
      user.joinedRooms.sort((a, b) => {
        if (a.pinned === b.pinned) {
          return 0;
        }
        return a.pinned ? -1 : 1;
      });
      const newUserData: any = JSON.parse(JSON.stringify(user));
      newUserData.joinedRooms = newUserData.joinedRooms.map((room: any) => {
        return {
          name: room.room.name,
          slug: room.room.slug,
          createdBy: room.room.createdBy,
          pinned: room.pinned,
        };
      });

      return res.status(200).json({ user: newUserData });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
};

export default userControllers;
