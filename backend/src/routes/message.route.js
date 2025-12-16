import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsers , getFriendsList, getMessages , sendMessage  } from "../controllers/message.controller.js";


const router = express.Router();

router.get("/user" , protectRoute , getUsers)
router.get("/friends" , protectRoute , getFriendsList)
router.get("/:id" , protectRoute , getMessages) 
router.post("/send/:id" , protectRoute , sendMessage)


export default router;