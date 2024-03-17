import express from "express";
import authRouter from "./authRouters";
import roomRouter from "./roomRouters";
import userRouter from "./userRouters";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/room", roomRouter);
router.use("/user", userRouter);

export default router;
