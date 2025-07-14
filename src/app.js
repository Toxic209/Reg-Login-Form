import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({
    path : './.env'
})

const app = express();
app.use(cors({
    origin: process.env.CORS,
    credentials: true
}))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser());

import { router } from "./routes/user.route.js";

app.use("/api/v1/users", router)

export default app;