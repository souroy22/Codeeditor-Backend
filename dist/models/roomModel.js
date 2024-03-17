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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const roomSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        default: "",
    },
    onlineUsers: {
        type: [mongoose_1.default.Schema.ObjectId],
        ref: "User",
        default: [],
    },
    createdBy: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
roomSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            try {
                const hashedPassword = yield bcrypt_1.default.hash(this.password, 10);
                this.password = hashedPassword;
            }
            catch (error) {
                if (error instanceof Error) {
                    return next(error);
                }
            }
        }
        return next();
    });
});
const Room = mongoose_1.default.model("Room", roomSchema);
exports.default = Room;
//# sourceMappingURL=roomModel.js.map