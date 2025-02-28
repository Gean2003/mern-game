import express from "express";
import { checkAuth, login, logout, signup, updatePassword } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-password",protectedRoute, updatePassword);

router.get("/checkout", protectedRoute, checkAuth)

export default router;
