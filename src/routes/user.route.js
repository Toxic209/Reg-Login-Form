import { Router } from "express";
import {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changePassword,
    getCurrentUser,
    changeUserData,
    updateAvatar
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), registerUser);

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changePassword)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-user").post(verifyJWT, changeUserData)
router.route("/update-avatar").post(verifyJWT, updateAvatar)

export { router }