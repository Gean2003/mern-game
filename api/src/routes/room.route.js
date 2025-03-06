import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { createRoom, updateRoom } from "../controllers/room.controller.js";

const router = express.Router();

//router.post("/:id")
router.post("/create", protectedRoute, createRoom )

router.patch("/send/:id", protectedRoute, updateRoom)

export default router;