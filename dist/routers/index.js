"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouters_1 = __importDefault(require("./authRouters"));
const roomRouters_1 = __importDefault(require("./roomRouters"));
const userRouters_1 = __importDefault(require("./userRouters"));
const router = express_1.default.Router();
router.use("/auth", authRouters_1.default);
router.use("/room", roomRouters_1.default);
router.use("/user", userRouters_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map