import express from "express";
import checkMissingFields from "../middlewares/checkMissingFields";
import { verifyToken } from "../middlewares/verifyToken";
import roomControllers from "../controllers/roomControllers";

const roomRouter = express.Router();

roomRouter.post(
  "/create",
  verifyToken,
  checkMissingFields.createARoom,
  roomControllers.createARoom
);

roomRouter.get("/all", verifyToken, roomControllers.getAllRoomsForAUser);

roomRouter.get(
  "/:slug",
  verifyToken,
  checkMissingFields.getARoom,
  roomControllers.getARoom
);

roomRouter.put("/:slug", verifyToken, roomControllers.pinnedARoom);

export default roomRouter;
