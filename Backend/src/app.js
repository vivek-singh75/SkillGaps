const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const authRoute = require("../src/routes/auth.route");
const interviewRouter = require("../src/routes/interview.route");
const resumeRouter = require("../src/routes/resume.route");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://vivek-singh75.github.io",
    credentials: true
}));

app.use("/api/auth", authRoute);
app.use("/api/interviewReport", interviewRouter);
app.use("/api/resume", resumeRouter);

module.exports = app;