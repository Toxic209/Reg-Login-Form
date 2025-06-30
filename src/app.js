import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({
    path : './.env'
})
import connectDB from "./db/index.js";

const app = express();
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded())
app.use(cookieParser());

export default app;