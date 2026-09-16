const express = require("express");
const config = require("./src/config/config")
const app = require("./src/app");
const connectDB = require("./src/DB/db")


connectDB()


const PORT =  config.PORT || 4000


app.listen(PORT , ()=>{
    console.log(`server is running on port number ${PORT}`)
});