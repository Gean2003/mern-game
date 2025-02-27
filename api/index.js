import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/lib/db.js";

dotenv.config()

const app = express();


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server Active",
        status: 200
    })
})


app.listen(8000, () => {
    console.log("Server runing on port " , 8000);
    connectDB()
})