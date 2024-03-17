import { Request, Response } from "express";
import slugify from "slugify";
import Room from "../models/roomModel";
import ShortUniqueId from "short-unique-id";
import User from "../models/userModel";

const uid = new ShortUniqueId({ length: 4 });

const roomControllers = {
  createARoom: async (req: Request, res: Response) => {
    try {
      const { name, password } = req.body;
      let slug: string = slugify(name, { lower: true });
      const existingRoom = await Room.findOne({ slug });

      if (existingRoom) {
        slug = slug + "-" + uid.rnd();
      }

      const room = new Room({
        name,
        slug,
        password,
        createdBy: req.user.user.id,
      });
      await room.save();
      await User.findByIdAndUpdate(
        req.user.user.id,
        { $push: { joinedRooms: { room: room._id, pinned: false } } },
        { new: true }
      );
      return res
        .status(200)
        .json({ room: { name: room.name, slug: room.slug } });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getARoom: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const room = await Room.findOne(
        { slug },
        { name: 1, slug: 1, code: 1, onlineUsers: 1, createdBy: 1, _id: 0 }
      ).populate([
        { path: "onlineUsers", select: "name -_id" },
        { path: "createdBy", select: "name -_id" },
      ]);
      return res.status(200).json({ room });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getAllRoomsForAUser: async (req: Request, res: Response) => {
    try {
      const rooms = await User.findById(req.user.user.id, {
        joinedRooms: 1,
        _id: 0,
      }).populate({
        path: "joinedRooms",
        select: "name slug createdBy onlineUsers -_id",
        populate: [
          { path: "onlineUsers", select: "name -_id" },
          { path: "createdBy", select: "name -_id" },
        ],
      });

      return res.status(200).json({ rooms });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  pinnedARoom: async (req: Request, res: Response) => {
    try {
      const { pin } = req.query;
      console.log("Pin", typeof pin);
      const { slug } = req.params;
      const room = await Room.findOne({ slug });
      if (room) {
        await User.findOneAndUpdate(
          { _id: req.user.user.id, "joinedRooms.room": room._id },
          { $set: { "joinedRooms.$.pinned": pin === "true" } },
          { new: true }
        );
      }
      return res.status(200).json({ msg: "Pinned successfully" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default roomControllers;
