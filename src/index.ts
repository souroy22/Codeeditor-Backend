// packages imports
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

// files
import router from "./routers/index";
import connectDB from "./db/dbConfig";
import { corsOptions } from "./configs/corsConfig";
import configureSocketEvents from "./sockets/index";

const app = express();
const PORT: string = process.env.PORT || "8000";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user: Record<string, any>;
      token: string | null;
    }
  }
}

app.use(express.json({ limit: "10kb" }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  res.send("Hiiii Hello");
});
connectDB();
app.use("/api/v1", router);

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
configureSocketEvents(io);
