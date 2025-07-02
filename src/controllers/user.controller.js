import { AsyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs"


const registerUser = AsyncHandler(async (req, res) => {
    
    const {username, password, email} = req.body;
    // validate the user inputs.
    if ([username, password, email].some((field) => field?.trim === "")) {
        throw new ApiError(400, "All fields are Required!")
    }
    // check if user already exists. If exists, return accordingly.
    const existingEmail = await User.findOne({email});
    if (existingEmail) {
        throw new ApiError(400, "Email already exists!");
    }

    const existingUsername = await User.findOne({username});
    if (existingUsername) {
        throw new ApiError(400, "Username already exists!");
    }

    if (password.length <= 7) {
        throw new ApiError(400, "Password needs to be longer than 8 characters!")
    }
    // check for avatar image. 
    
    const avatarLocalPath = req.files?.avatar[0]?.path;  
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar path is Required!")
    }
    
    // upload images to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    
    //check if avatar is uploaded on CLoudinary
    if (!avatar) {
        throw new ApiError(400, "Avatar is Required!") 
    }
    // save the user entry in the database.
    const user = await User.create({
        username: username.toLowerCase(),
        password,
        email,
        avatar: avatarLocalPath
    })
    // remove the password and refresh token fields from the db entry.
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    // check if the user is created.
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the User.")
    }
    // if created, return response.
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Registered Successfully!")
    )
})

export {registerUser}