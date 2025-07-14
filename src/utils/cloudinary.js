import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { ApiError } from "../utils/ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (err) {
                console.warn("🧹 File deletion error:", err.message);
            }
        }
        return response.secure_url;
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error)
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary }