const express = require("express");
const cookieParser = require("cookie-parser"); 
const app = express();
const cors = require("cors");

const authRoute = require("../src/routes/auth.route");
const interviewRouter = require("../src/routes/interview.route");
const resumeRouter = require("../src/routes/resume.route");
 

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials : true
}));

app.use("/api/auth" , authRoute);

app.use("/api/interviewReport" ,  interviewRouter);

app.use("/api/resume" , resumeRouter)


module.exports = app