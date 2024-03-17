import { Server } from "socket.io";
import configureRoomEvents from "./roomEvents";
import configureUserEvents from "./userEvents";

export const SOCKET_EVENT_TYPE = {
  JOINED: "joined",
  JOIN: "join",
  LEFT: "left",
  CODE_CHANGE: "codeChange",
  UNAUTHORISED: "unauthorised",
  INVALID_ROOM_ID: "invalidRoomID",
};

const configureSocketEvents = (io: Server) => {
  configureUserEvents(io);
  configureRoomEvents(io);
};

export default configureSocketEvents;
