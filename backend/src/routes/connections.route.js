import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getPendingConnections , createConnection, getNotificationUsers, deleteConnection , updateConnectionStatus} from "../controllers/connections.controller.js";

const router = express.Router();


router.get("/pending" , protectRoute , getPendingConnections)
router.get("/notification-user" , protectRoute , getNotificationUsers)
router.post("/" , protectRoute , createConnection)
router.delete("/" , protectRoute , deleteConnection)
router.put("/accept-request" , protectRoute , (req,res) => updateConnectionStatus(req,res,"accepted"))

export default router;  