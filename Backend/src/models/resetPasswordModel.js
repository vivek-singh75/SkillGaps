const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        unique: true,
        required: true
    },
    email: {
        type: String,
        ref: "users",
        unique: true,
        required: true
    },

    otpHash: {
        type: String,
        required: true
    },

    expireAt: {
        type: Date,
        required: true
    },

    attempt: {
        type: Number,
        default: 0
    },

    verified: {
        type: Boolean,
        default: false
    },
    resetTokenHash: {
        type: String,
        default: null
    },
    resetTokenExpireAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

otpSchema.index(
    { expireAt: 1 },
    { expireAfterSeconds: 0 }
);

const otpModel = mongoose.model("otp" , otpSchema);

module.exports = otpModel;