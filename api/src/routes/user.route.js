import express from "express";

const router = express.Router();

router.get("/friends")
router.post("/friends/request/:id")
router.delete("/friends/:id")

export default router;