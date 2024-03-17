"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkMissingFields_1 = __importDefault(require("../middlewares/checkMissingFields"));
const verifyToken_1 = require("../middlewares/verifyToken");
const roomControllers_1 = __importDefault(require("../controllers/roomControllers"));
const roomRouter = express_1.default.Router();
roomRouter.post("/create", verifyToken_1.verifyToken, checkMissingFields_1.default.createARoom, roomControllers_1.default.createARoom);
roomRouter.get("/all", verifyToken_1.verifyToken, roomControllers_1.default.getAllRoomsForAUser);
roomRouter.get("/:slug", verifyToken_1.verifyToken, checkMissingFields_1.default.getARoom, roomControllers_1.default.getARoom);
roomRouter.put("/:slug", verifyToken_1.verifyToken, roomControllers_1.default.pinnedARoom);
exports.default = roomRouter;
//# sourceMappingURL=roomRouters.js.map