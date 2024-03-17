"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const roomModel_1 = __importDefault(require("../models/roomModel"));
const _1 = require(".");
const userModel_1 = __importDefault(require("../models/userModel"));
const configureRoomEvents = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.on("join", (slug, token) => __awaiter(void 0, void 0, void 0, function* () {
            yield jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "", (error, user) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    socket.emit(_1.SOCKET_EVENT_TYPE.UNAUTHORISED, "Please login");
                    return;
                }
                const isUserExist = yield userModel_1.default.findById(user.id);
                if (!isUserExist) {
                    socket
                        .to(socket.id)
                        .emit(_1.SOCKET_EVENT_TYPE.UNAUTHORISED, "Please login");
                    return;
                }
                const room = yield roomModel_1.default.findOneAndUpdate({ slug }, { $push: { onlineUsers: user.id } });
                if (!room) {
                    socket
                        .to(socket.id)
                        .emit(_1.SOCKET_EVENT_TYPE.INVALID_ROOM_ID, "Invalid room data");
                    return;
                }
                const isFirstTime = yield userModel_1.default.find({
                    joinedRooms: { $in: [room._id] },
                });
                if (!isFirstTime) {
                    yield userModel_1.default.findByIdAndUpdate(user.id, {
                        $push: { joinedRooms: room._id },
                    });
                }
                socket.join(room._id.toString());
            }));
        }));
        socket.on(_1.SOCKET_EVENT_TYPE.CODE_CHANGE, (data) => __awaiter(void 0, void 0, void 0, function* () {
            const room = yield roomModel_1.default.findOne({ slug: data.slug });
            if (!room) {
                return console.error("Room not found");
            }
            yield roomModel_1.default.updateOne({ _id: room._id }, { code: data.code });
            io.to(room._id.toString()).emit("codeChange", data.code);
        }));
    });
};
exports.default = configureRoomEvents;
//# sourceMappingURL=roomEvents.js.map