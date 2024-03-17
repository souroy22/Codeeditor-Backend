"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = __importDefault(require("../controllers/authControllers"));
const checkMissingFields_1 = __importDefault(require("../middlewares/checkMissingFields"));
const verifyToken_1 = require("../middlewares/verifyToken");
const authRouter = express_1.default.Router();
authRouter.post("/signup", checkMissingFields_1.default.signup, authControllers_1.default.signup);
authRouter.post("/signin", checkMissingFields_1.default.signin, authControllers_1.default.signin);
authRouter.get("/signout", verifyToken_1.verifyToken, authControllers_1.default.signout);
exports.default = authRouter;
//# sourceMappingURL=authRouters.js.map