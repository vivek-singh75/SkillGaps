const mongoose = require("mongoose");

const tokenBlackListSchema = new mongoose.Schema({
    token: {
        type: String, 
        required :[true , "token is required to be added in blacklist"]
    }
},{timestamps: true});


const tokenBlackListModel = mongoose.model("blackListToken" , tokenBlackListSchema);

module.exports = tokenBlackListModel;