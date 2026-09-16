const mongoose = require("mongoose");
const dns = require("dns");
const config = require("../config/config")

dns.setServers(['8.8.8.8' , '8.8.4.4']);

async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);

        console.log("database connected");

    } catch (error) {
        
        console.log(`error while connecting to database ${error}`);
    }
}  

module.exports = connectDB;