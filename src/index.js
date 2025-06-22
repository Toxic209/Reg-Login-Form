import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { DB_NAME } from "./constants.js";
dotenv.config({
    path : './.env'
})

import connectDB from "./db/index.js";
connectDB();

