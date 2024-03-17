import express from "express";
import authControllers from "../controllers/authControllers";
import checkMissingFields from "../middlewares/checkMissingFields";
import { verifyToken } from "../middlewares/verifyToken";

const authRouter = express.Router();

authRouter.post("/signup", checkMissingFields.signup, authControllers.signup);
authRouter.post("/signin", checkMissingFields.signin, authControllers.signin);
authRouter.get("/signout", verifyToken, authControllers.signout);

export default authRouter;
