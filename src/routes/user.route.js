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


router.route("/register").post((req, res, next) => {
    next();
}, (req, res, next) => {
    upload.fields([
        { name: "avatar", maxCount: 1 }
    ])(req, res, function (err) {
        if (err) {
            return res.status(500).json({ message: "Multer failed", error: err.message });
        }
        console.log("✅ Multer succeeded!");
        next();
    });
}, (req, res, next) => {
    next();
},
    registerUser);

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changePassword)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-user").post(verifyJWT, changeUserData)
router.route("/update-avatar").post(verifyJWT, updateAvatar)

export { router }