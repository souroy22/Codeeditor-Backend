"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENT_TYPE = void 0;
const roomEvents_1 = __importDefault(require("./roomEvents"));
const userEvents_1 = __importDefault(require("./userEvents"));
exports.SOCKET_EVENT_TYPE = {
    JOINED: "joined",
    JOIN: "join",
    LEFT: "left",
    CODE_CHANGE: "codeChange",
    UNAUTHORISED: "unauthorised",
    INVALID_ROOM_ID: "invalidRoomID",
};
const configureSocketEvents = (io) => {
    (0, userEvents_1.default)(io);
    (0, roomEvents_1.default)(io);
};
exports.default = configureSocketEvents;
//# sourceMappingURL=index.js.map