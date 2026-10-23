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

module.exports = {
    sendVerificationEmail
};