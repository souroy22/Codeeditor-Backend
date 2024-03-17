import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Room from "../models/roomModel";
import User from "../models/userModel";
import { SOCKET_EVENT_TYPE } from ".";

const configureUserEvents = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("connect", async (slug: string, token: string) => {
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
            socket.emit(SOCKET_EVENT_TYPE.UNAUTHORISED, "Please login");
          }
          const data = await Room.findOneAndUpdate(
            { slug },
            { $push: { onlineUsers: user.id } },
            { new: true }
          )
            .populate([
              { path: "onlineUsers", select: "name -_id" },
              { path: "createdBy", select: "name -_id" },
            ])
            .select({
              name: 1,
              slug: 1,
              onlineUsers: 1,
              createdBy: 1,
              code: 1,
              _id: 0,
            });
          socket.emit(SOCKET_EVENT_TYPE.JOINED, {
            message: `${user.name} joined`,
            data,
          });
          console.log(`User connected: ${user.name}`);
        }
      );
    });
    socket.on("disconnect", async (slug: string, token: string) => {
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
          const data = await Room.findOneAndUpdate(
            { slug },
            { $pop: { onlineUsers: user.id } },
            { new: true }
          )
            .populate([
              { path: "onlineUsers", select: "name -_id" },
              { path: "createdBy", select: "name -_id" },
            ])
            .select({
              slug: 1,
              onlineUsers: 1,
              _id: 0,
            });
          socket.broadcast.emit(SOCKET_EVENT_TYPE.LEFT, {
            message: `${user.name} left the room`,
            data,
          });
          console.log(`User connected: ${user.name}`);
        }
      );
    });
  });
};

export default configureUserEvents;
