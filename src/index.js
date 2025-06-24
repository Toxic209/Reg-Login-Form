import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})
import mongoose from 'mongoose';
import { DB_NAME } from "./constants.js";
import app from "./app.js"
import connectDB from './db/index.js';
const PORT = process.env.PORT || 8000;

// Server launching & DB connection...

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });
    }
    catch (error) {
        console.log("Failed to connect to the server ", error);
        process.exit(1)
    }
}

startServer();