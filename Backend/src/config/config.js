const dotenv  = require("dotenv");

dotenv.config();

if(!process.env.MONGO_URI){
    console.log("MONGO_URI is not availble ")
}

if(!process.env.JWT_KEY){
    console.log("JWT_KEY is not availble ")
}

if(!process.env.GOOGLE_GENAI_API_KEY){
    console.log("GOOGLE_GENAI_API_KEY is not availble ")
}

const config ={
    PORT : process.env.PORT,
    MONGO_URI : process.env.MONGO_URI,
    JWT_KEY : process.env.JWT_KEY,
    GOOGLE_GENAI_API_KEY : process.env.GOOGLE_GENAI_API_KEY
}

module.exports = config;