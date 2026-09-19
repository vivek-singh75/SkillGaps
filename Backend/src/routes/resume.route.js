const express = require("express");
const upload = require("../middlleware/file.middleware");


const resumeRouter = express.Router();
const authMiddleware = require("../middlleware/auth.middleware");

const resumeGen = require("../controller/resume.controller")

resumeRouter.post("/generate" ,authMiddleware.authUser,  upload.single("resume") , resumeGen.generateResumeController)

module.exports = resumeRouter