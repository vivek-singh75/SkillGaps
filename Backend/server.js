const express = require("express");
const config = require("./src/config/config")
const app = require("./src/app");
const connectDB = require("./src/DB/db")

connectDB()


const PORT =  config.PORT || 5000


app.listen(PORT ,"0.0.0.0" , ()=>{
    console.log(`server is running on port number ${PORT}`)
});