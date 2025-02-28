import express from "express";

const router = express.Router();

router.get("/users")
router.post("/:id")
router.post("create/room")

router.post("/send/:id")

export default router;