const express = require("express");
const router = express.Router();


const authMiddleware = require("../middlleware/auth.middleware");

const authController = require("../controller/auth.controller");




router.post("/register" , authController.registerUserController);

router.post("/login" , authController.loginController);

router.get("/logout" , authController.logoutController);

router.get("/getMe" ,  authController.getMe);

router.patch("/updatDetails" , authMiddleware.authUser , authController.updateUserDetails);

router.patch("/updatePass" , authMiddleware.authUser , authController.updateUserpassword);

router.delete("/delete" ,authMiddleware.authUser,  authController.deleteAccController);

module.exports = router;




