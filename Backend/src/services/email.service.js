const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

async function sendVerificationEmail(email, token) {

    const verificationUrl =
        `${process.env.FRONTEND_URL}/#/verify-email?token=${token}`;

    await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            email: process.env.EMAIL_FROM,
            name: "SkillGaps"
        },

        to: [
            {
                email: email
            }
        ],

        subject: "Verify your SkillGaps account",

        htmlContent: `
            <html>
                <body>
                    <h2>Welcome to SkillGaps 👋</h2>

                    <p>Please verify your email address.</p>

                    <p>
                        <a
                            href="${verificationUrl}"
                            style="
                                display:inline-block;
                                padding:12px 20px;
                                background:#6366f1;
                                color:white;
                                text-decoration:none;
                                border-radius:6px;
                            "
                        >
                            Verify Email
                        </a>
                    </p>

                    <p>
                        This link will expire in 15 minutes.
                    </p>
                </body>
            </html>
        `
    });
}


async function sendOTP(userEmail, otp) {
    await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            email: process.env.EMAIL_FROM,
            name: "SkillGaps"
        },

        to: [{
            email: userEmail
        }],

        subject: "Reset Password OTP",

        htmlContent: `
        <html>
        <body style="font-family: Arial; color: #333;">
            <h2>SkillGaps - Password Reset</h2>
            <p>Your OTP for resetting your password is:</p>
            <h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
            <p>Do not share this OTP with anyone.</p>
            <p>If you didn't request this, ignore this email.</p>
            <p>Regards,<br>Team SkillGaps</p>
        </body>
        </html>
        `
    });
}



module.exports = {
    sendVerificationEmail,
    sendOTP
};