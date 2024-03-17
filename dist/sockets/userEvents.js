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
const userModel_1 = __importDefault(require("../models/userModel"));
const _1 = require(".");
const configureUserEvents = (io) => {
    io.on("connection", (socket) => {
        socket.on("connect", (slug, token) => __awaiter(void 0, void 0, void 0, function* () {
            yield jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "", (error, user) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    socket.emit(_1.SOCKET_EVENT_TYPE.UNAUTHORISED, "Please login");
                    return;
                }
                const isUserExist = yield userModel_1.default.findById(user.id);
                if (!isUserExist) {
                    socket.emit(_1.SOCKET_EVENT_TYPE.UNAUTHORISED, "Please login");
                }
                const data = yield roomModel_1.default.findOneAndUpdate({ slug }, { $push: { onlineUsers: user.id } }, { new: true })
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
                socket.emit(_1.SOCKET_EVENT_TYPE.JOINED, {
                    message: `${user.name} joined`,
                    data,
                });
                console.log(`User connected: ${user.name}`);
            }));
        }));
        socket.on("disconnect", (slug, token) => __awaiter(void 0, void 0, void 0, function* () {
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
                const data = yield roomModel_1.default.findOneAndUpdate({ slug }, { $pop: { onlineUsers: user.id } }, { new: true })
                    .populate([
                    { path: "onlineUsers", select: "name -_id" },
                    { path: "createdBy", select: "name -_id" },
                ])
                    .select({
                    slug: 1,
                    onlineUsers: 1,
                    _id: 0,
                });
                socket.broadcast.emit(_1.SOCKET_EVENT_TYPE.LEFT, {
                    message: `${user.name} left the room`,
                    data,
                });
                console.log(`User connected: ${user.name}`);
            }));
        }));
    });
};
exports.default = configureUserEvents;
//# sourceMappingURL=userEvents.js.map