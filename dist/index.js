"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// packages imports
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// files
const index_1 = __importDefault(require("./routers/index"));
const dbConfig_1 = __importDefault(require("./db/dbConfig"));
const corsConfig_1 = require("./configs/corsConfig");
const index_2 = __importDefault(require("./sockets/index"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || "5000";
dotenv_1.default.config();
app.use(express_1.default.json({ limit: "10kb" }));
app.use((0, cors_1.default)(corsConfig_1.corsOptions));
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
(0, dbConfig_1.default)();
app.get("/", (_, res) => {
    res.send("Hello World HIIII!");
});
app.use("/api/v1", index_1.default);
const server = app.listen(parseInt(PORT, 10), `0.0.0.0`, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: ["http://localhost:5173", "https://physioo.netlify.app"],
    },
});
// Configure Socket.IO events
(0, index_2.default)(io);
//# sourceMappingURL=index.js.map