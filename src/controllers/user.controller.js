import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateRefreshAndAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong when generating Tokens!", error)
    }
}

const registerUser = AsyncHandler(async (req, res) => {

    const { username, password, email, } = req.body;
    // validate the user inputs.
    if ([username, password, email].some((field) => field?.trim === "")) {
        throw new ApiError(400, "All fields are Required!")
    }
    // check if user already exists. If exists, return accordingly.
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new ApiError(400, "Email already exists!");
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        throw new ApiError(400, "Username already exists!");
    }

    if (password.length <= 7) {
        throw new ApiError(400, "Password needs to be longer than 8 characters!")
    }
    // check for avatar image. 
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

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

const loginUser = AsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Username & Email is Required!")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exists!")
    }

    const validPassword = await user.isPasswordCorrect(password);

    if (!validPassword) {
        throw new ApiError(401, "Incorrect Password!")
    }


    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(
                201,
                { user: loggedInUser, refreshToken: refreshToken, accessToken: accessToken },
                "User Logged In!"
            )
        )
})

const logoutUser = AsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        { new: true },
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User Logged Out!"))
})

const refreshAccessToken = AsyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(400, "Unauthorized Request!")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decodedToken) {
        throw new ApiError(401, "Unauthorised Access Request!")
    }

    const user = await User.findById(decodedToken?._id).select("-password - refreshToken")

    if (!user) {
        throw new ApiError(400, "Invalid Refresh Token!")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token Expired!")
    }
    const { accessToken, newRefreshToken } = generateRefreshAndAccessToken(user._id);

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(new ApiResponse(201, { accessToken, refreshToken: newRefreshToken }, "Access Token Refreshed"))
})

const changePassword = AsyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password needs to be different!")
    }

    const user = await User.findById(req.user._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if ((!isPasswordCorrect)) {
        throw new ApiError(400, "Invalid Old Password!")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "Password updated Successfully!"))
})

const getCurrentUser = AsyncHandler(async (req, res) => {
    if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
    return res.json(new ApiResponse(200, req.user, "Current user fetched!"))
})

const changeUserData = AsyncHandler(async (req, res) => {
    const { username, email } = req.body

    if (!(username || email)) {
        throw new ApiError(400, "Username or Email needs to be updated!")
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            username,
            email
        }
    },
        { new: true }
    ).select("-password")

    if (!user) {
        throw new ApiError(404, "No User Found!")
    }

    return res.status(200).json(new ApiResponse(200, user, "User Data Updated!"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    changeUserData
}