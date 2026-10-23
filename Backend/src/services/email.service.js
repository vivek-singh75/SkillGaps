const nodemailer =  require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendVerificationEmail(email, token) {

    const verificationUrl =
        `${process.env.FRONTEND_URL}/#/verify-email?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your SkillGaps account",

        html: `
            <h2>Welcome to SkillGaps 👋</h2>

            <p>Please verify your email address.</p>

            <a href="${verificationUrl}">
                Verify Email
            </a>

            <p>This link will expire in 15 minutes.</p>
        `
    });
}
module.exports = {sendVerificationEmail}