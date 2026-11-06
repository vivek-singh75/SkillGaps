const express = require("express");

const resetPasswordRouter = express.Router();

const resetController = require("../controller/resetPasswordController");


resetPasswordRouter.post("/verifyEmail" , resetController.verifyEmail);

resetPasswordRouter.post("/verifyOTP" , resetController.verifyOTP);

resetPasswordRouter.post("/resendOTP" , resetController.resendOTP);

resetPasswordRouter.patch("/updatePassword" , resetController.updatePasswordController);

 

module.exports = resetPasswordRouter;