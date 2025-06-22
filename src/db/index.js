import dotenv from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
dotenv.config({
    path : './.env'
})


const connectDB = async () => {
    try {
        const databaseInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n Database is Connected !!! Host : ${databaseInstance.connection.host}`);
    }
    catch (error) {
        console.error("Error connecting Database : ", error);
        process.exit(1);
    }
}

export default connectDB;