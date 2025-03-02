import express from "express";
import { deleteFriend, getFriendRequest, getFriends, newFriendRequest, searchByUsername, updateFriendRequest } from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/friends",protectedRoute, getFriends)
router.post("/friends/request/:id", protectedRoute, newFriendRequest)
router.get("/friends/request/", protectedRoute, getFriendRequest)
router.post("/friends/request/update/:id", protectedRoute, updateFriendRequest)
router.delete("/friends/:id", protectedRoute, deleteFriend)

router.get("/search/:name", protectedRoute, searchByUsername)

export default router;