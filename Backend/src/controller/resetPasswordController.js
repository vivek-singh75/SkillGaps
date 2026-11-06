
const userModel = require("../models/userModel");
const resetPasswordModel = require("../models/resetPasswordModel");
const { sendOTP } = require("../services/email.service");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");


// Common function: Generate and save OTP
async function generateAndSendOTP(user) {

    const otp = crypto.randomInt(1000, 10000).toString();

    const otpHash = await bcrypt.hash(otp, 10);

    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    // Create new record OR update existing record
    await resetPasswordModel.findOneAndUpdate(
        { userId: user._id },
        {
            $set: {
                email: user.email,
                otpHash,
                expireAt,
                attempt: 0,
                verified: false,
                resetTokenHash: null,
                resetTokenExpireAt: null
            }
        },
        {
            returnDocument: "after",
            upsert: true,
            setDefaultsOnInsert: true
        }
    );

    await sendOTP(user.email, otp);
}


// 1. Verify Email / Send OTP
async function verifyEmail(req, res) {

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email not provided"
            });
        }

        const user = await userModel.findOne({ email });

        // Generic response to avoid email enumeration
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If the account exists, an OTP will be sent."
            });
        }

        await generateAndSendOTP(user);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Unable to send OTP"
        });
    }
}


// 2. Verify OTP
async function verifyOTP(req, res) {

    try {

        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const otpData = await resetPasswordModel.findOne({ email });

        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        // Check OTP state before bcrypt comparison
        if (
            otpData.verified ||
            !otpData.otpHash ||
            otpData.expireAt <= new Date()
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        if (otpData.attempt >= 5) {
            return res.status(429).json({
                success: false,
                message: "Maximum attempts reached. Please resend OTP."
            });
        }

        const isOtpCorrect = await bcrypt.compare(
            otp.toString(),
            otpData.otpHash
        );

        // Incorrect OTP: increment attempt in one query
        if (!isOtpCorrect) {

            const failedAttempt = await resetPasswordModel.findOneAndUpdate(
                {
                    _id: otpData._id,
                    verified: false,
                    expireAt: { $gt: new Date() },
                    attempt: { $lt: 5 }
                },
                {
                    $inc: { attempt: 1 }
                },
                { returnDocument: "after" }
            );

            if (!failedAttempt) {
                return res.status(429).json({
                    success: false,
                    message: "Maximum attempts reached or OTP expired. Please resend OTP."
                });
            }

            return res.status(
                failedAttempt.attempt >= 5 ? 429 : 401
            ).json({
                success: false,
                message: failedAttempt.attempt >= 5
                    ? "Maximum attempts reached. Please resend OTP."
                    : "Incorrect OTP"
            });
        }

        // Correct OTP: generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const resetTokenExpireAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // One atomic update
        const afterUpdate = await resetPasswordModel.findOneAndUpdate(
            {
                _id: otpData._id,
                verified: false,
                expireAt: { $gt: new Date() },
                attempt: { $lt: 5 }
            },
            {
                $set: {
                    verified: true,
                    otpHash: null,
                    resetTokenHash,
                    resetTokenExpireAt,
                    expireAt: resetTokenExpireAt
                }
            },
            { returnDocument: "after" }
        );

        if (!afterUpdate) {
            return res.status(401).json({
                success: false,
                message: "OTP is invalid or expired"
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verification successful",
            resetToken
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "OTP verification failed"
        });
    }
}


// 3. Resend OTP
async function resendOTP(req, res) {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email not provided"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If the account exists, an OTP will be sent."
            });
        }

        // Replace old OTP with new OTP
        await generateAndSendOTP(user);

        return res.status(200).json({
            success: true,
            message: "New OTP sent successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Unable to resend OTP"
        });
    }
}


async function updatePasswordController(req , res) {

    try {
        const {resetToken , email , newPassword} = req.body;

        if(!resetToken || !email || !newPassword){
            return res.status(401).json({
                success: false,
                message : "Token or Email or Password is not Received"
            })
        } 

        const resetPassword = await resetPasswordModel.findOne({email})

        if(!resetPassword){
            return res.status(404).json({
                success : false,
                message : "Token is Expired or InValid "
            })
        }

        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const isTokenIsValid = resetTokenHash === resetPassword.resetTokenHash

        if(!isTokenIsValid){
            return res.status(403).json({
                success : false,
                message : "Token is InValid "
            })
        }

        const passwordhash =  await bcrypt.hash(newPassword, 10);
        

        const updatePassword  = await userModel.findOneAndUpdate({email},
            {   
                $set :{
                    password: passwordhash
                }
            },{returnDocument: "after"}

        ) 


        if(!updatePassword){
            return res.status(501).json({
                success : false,
                message : "Password Updation Failed"
            })
        }

        res.status(200).json({
            success : true,
            message : "Password Change Successfull",
            response : updatePassword
        })


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "OTP verification failed"
        });
    }
    

}




module.exports = {
    verifyEmail,
    verifyOTP,
    resendOTP,
    updatePasswordController
};
