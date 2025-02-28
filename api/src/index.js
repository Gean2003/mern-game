import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors";
import { connectDB } from "./lib/db.js";
import  authRoute  from "./routes/auth.route.js"
import  roomRoute  from "./routes/room.route.js"
import userRoute from "./routes/user.route.js"

dotenv.config()

const app = express();

const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server Active",
        status: 200
    })
})

app.use("/api/auth", authRoute);
app.use("/api/room", roomRoute);
app.use("/api/user", userRoute);


app.listen(PORT, () => {
    console.log("Server runing on port " , PORT);
    connectDB()
})