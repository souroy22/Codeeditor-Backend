import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Room from "../models/roomModel";

import { SOCKET_EVENT_TYPE } from ".";
import User from "../models/userModel";

const configureRoomEvents = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");
    socket.on("join", async (slug: string, token: string) => {
      await jwt.verify(
        token,
        process.env.SECRET_KEY || "",
        async (error, user: any) => {
          if (error) {
            socket.emit(SOCKET_EVENT_TYPE.UNAUTHORISED, "Please login");
            return;
          }
          const isUserExist = await User.findById(user.id);
          if (!isUserExist) {
            socket
              .to(socket.id)
              .emit(SOCKET_EVENT_TYPE.UNAUTHORISED, "Please login");
            return;
          }
          const room = await Room.findOneAndUpdate(
            { slug },
            { $push: { onlineUsers: user.id } }
          );
          if (!room) {
            socket
              .to(socket.id)
              .emit(SOCKET_EVENT_TYPE.INVALID_ROOM_ID, "Invalid room data");
            return;
          }
          const isFirstTime = await User.find({
            joinedRooms: { $in: [room._id] },
          });
          if (!isFirstTime) {
            await User.findByIdAndUpdate(user.id, {
              $push: { joinedRooms: room._id },
            });
          }
          socket.join(room._id.toString());
        }
      );
    });
    socket.on(
      SOCKET_EVENT_TYPE.CODE_CHANGE,
      async (data: { slug: string; code: string }) => {
        const room = await Room.findOne({ slug: data.slug });
        if (!room) {
          return console.error("Room not found");
        }
        await Room.updateOne({ _id: room._id }, { code: data.code });
        io.to(room._id.toString()).emit("codeChange", data.code);
      }
    );
  });
};

export default configureRoomEvents;
