const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const authRoute = require("../src/routes/auth.route")

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials : true
}));

app.use("/api/auth" , authRoute)


module.exports = app