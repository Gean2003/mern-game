import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { sendMessage } from "../controllers/room.controller.js";

const router = express.Router();

router.post("/:id")
router.post("create/room")

router.post("/send/:id", protectedRoute, sendMessage)

export default router;