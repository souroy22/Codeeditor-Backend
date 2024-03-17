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
const slugify_1 = __importDefault(require("slugify"));
const roomModel_1 = __importDefault(require("../models/roomModel"));
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const userModel_1 = __importDefault(require("../models/userModel"));
const uid = new short_unique_id_1.default({ length: 4 });
const roomControllers = {
    createARoom: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, password } = req.body;
            let slug = (0, slugify_1.default)(name, { lower: true });
            const existingRoom = yield roomModel_1.default.findOne({ slug });
            if (existingRoom) {
                slug = slug + "-" + uid.rnd();
            }
            const room = new roomModel_1.default({
                name,
                slug,
                password,
                createdBy: req.user.user.id,
            });
            yield room.save();
            yield userModel_1.default.findByIdAndUpdate(req.user.user.id, { $push: { joinedRooms: { room: room._id, pinned: false } } }, { new: true });
            return res
                .status(200)
                .json({ room: { name: room.name, slug: room.slug } });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getARoom: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const room = yield roomModel_1.default.findOne({ slug }, { name: 1, slug: 1, code: 1, onlineUsers: 1, createdBy: 1, _id: 0 }).populate([
                { path: "onlineUsers", select: "name -_id" },
                { path: "createdBy", select: "name -_id" },
            ]);
            return res.status(200).json({ room });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getAllRoomsForAUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rooms = yield userModel_1.default.findById(req.user.user.id, {
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
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    pinnedARoom: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { pin } = req.query;
            console.log("Pin", typeof pin);
            const { slug } = req.params;
            const room = yield roomModel_1.default.findOne({ slug });
            if (room) {
                yield userModel_1.default.findOneAndUpdate({ _id: req.user.user.id, "joinedRooms.room": room._id }, { $set: { "joinedRooms.$.pinned": pin === "true" } }, { new: true });
            }
            return res.status(200).json({ msg: "Pinned successfully" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = roomControllers;
//# sourceMappingURL=roomControllers.js.map