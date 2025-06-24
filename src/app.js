import express from "express";
import dotenv from "dotenv";
dotenv.config({
    path : './.env'
})
import connectDB from "./db/index.js";

const app = express();
app.use(express.json())

export default app;