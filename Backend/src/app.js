const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const authRoute = require("../src/routes/auth.route");
const interviewRouter = require("../src/routes/interview.route");
const resumeRouter = require("../src/routes/resume.route");

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://vivek-singh75.github.io"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use("/api/auth", authRoute);
app.use("/api/interviewReport", interviewRouter);
app.use("/api/resume", resumeRouter);

module.exports = app;