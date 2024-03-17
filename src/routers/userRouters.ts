import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import userControllers from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/get-user", verifyToken, userControllers.getUserData);

export default userRouter;
