const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();


const authRoute = require("./routes/auth.route");
const interviewRouter = require("./routes/interview.route");
const resumeRouter = require("./routes/resume.route");
const resetPasswordRouter = require("./routes/resetPassword.route")

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://skillgaps-17320.web.app",
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
app.use("/api/reset" , resetPasswordRouter);


module.exports = app;