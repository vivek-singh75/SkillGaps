const express = require("express");
const interviewControllers =  require("../controller/interview.controller")
const authMiddleware = require("../middlleware/auth.middleware");
const upload = require("../middlleware/file.middleware");


const interviewRouter = express.Router();


interviewRouter.post("/" ,authMiddleware.authUser , upload.single("resume") , interviewControllers.interviewController);


module.exports = interviewRouter
