import { Request, Response } from "express";
import User, { JOINED_ROOMS_TYPE } from "../models/userModel";
import getUserData from "../utils/getUser";
import verifyPassword from "../utils/verifyPassword";
import genarateToken, { USER_TYPE } from "../utils/genarateToken";
import destroyToken from "../utils/destroyToken";

interface NEW_USER_TYPE extends USER_TYPE {
  avatar: string | null;
  name: string;
}

interface EXISTING_USER_TYPE extends NEW_USER_TYPE {
  joinedRooms: JOINED_ROOMS_TYPE[];
}

const authControllers = {
  signup: async (req: Request, res: Response) => {
    try {
      const { name, email, password, avatar = null } = req.body;
      const isExist = await getUserData(email);
      if (isExist !== null) {
        return res
          .status(400)
          .json({ error: "This mail id is already exist." });
      }
      let newUser = new User({ name, email, password, avatar });
      newUser = await newUser.save();
      const user: NEW_USER_TYPE = {
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar || null,
        id: newUser._id,
      };
      const token = await genarateToken({ id: user.id, email: user.email });
      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  signin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const isExist = await getUserData(email);
      if (isExist === null) {
        return res.status(400).json({ error: "This mailid doen't exists" });
      }
      if (!verifyPassword(password, isExist.password)) {
        return res
          .status(401)
          .json({ error: "EmailId or password doesn't match" });
      }
      const user: EXISTING_USER_TYPE = {
        name: isExist.name,
        email: isExist.email,
        avatar: isExist.avatar || null,
        id: isExist._id,
        joinedRooms: isExist.joinedRooms,
      };
      const token = await genarateToken({ id: user.id, email: user.email });
      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  signout: async (req: Request, res: Response) => {
    try {
      await destroyToken(req);
      return res.status(200).json({ msg: "Successfully logged out!" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
};

export default authControllers;
