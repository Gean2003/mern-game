import express from "express";

const app = express();


app.get("/", (req, res) => {
    res.send("<h1> Welcome </h1>")
})

app.listen(8000, () => {
    console.log("Server runing on port " , 8000)
})