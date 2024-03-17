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
const userModel_1 = __importDefault(require("../models/userModel"));
const userControllers = {
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findById(req.user.user.id, {
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
            const newUserData = JSON.parse(JSON.stringify(user));
            newUserData.joinedRooms = newUserData.joinedRooms.map((room) => {
                return {
                    name: room.room.name,
                    slug: room.room.slug,
                    createdBy: room.room.createdBy,
                    pinned: room.pinned,
                };
            });
            return res.status(200).json({ user: newUserData });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
};
exports.default = userControllers;
//# sourceMappingURL=userController.js.map