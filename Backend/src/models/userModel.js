const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required : [true ,  "username is must for creating account"],
        unique : [true , "username must be unique"],
        
    },
    email:{
        type : String,
        required : [true ,  "email is must for creating account"],
        unique : [true , "email must be unique"],
    },
    password:{
        type : String,
        required : [true ,  "password is must for creating account"],
    }
},{
    timestamps : true
});

const userModel = mongoose.model("users" , userSchema);

module.exports = userModel;
