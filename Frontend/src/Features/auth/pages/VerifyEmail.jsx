import React, { useEffect, useState ,  useRef} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import "../../../style/VerifyEmail.scss";


const VerifyEmail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const verificationStarted = useRef(false);

    const {
        handleVerifyEmail,
        handleResendEmail
    } = useAuth();


    // =====================================
    // GET EMAIL FROM REGISTER PAGE
    // =====================================

    const [email, setEmail] = useState(
        location.state?.email || ""
    );


    // =====================================
    // STATES
    // =====================================

    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);

    const [verified, setVerified] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =====================================
    // GET TOKEN FROM URL
    // =====================================

    const params = new URLSearchParams(
        location.search
    );

    const token = params.get("token");


    // =====================================
    // VERIFY EMAIL
    // =====================================

    useEffect(() => {
        if (!token) return;

        if (verificationStarted.current) return;

        verificationStarted.current = true;

        const verifyUserEmail = async () => {
            try {
                setVerifying(true);
                setError("");
                setMessage("");

                await handleVerifyEmail(token);

                setVerified(true);
                setMessage(
                    "Your email address has been verified successfully."
                );
            } catch (error) {
                console.error("Email verification failed:", error);

                setError(
                    error?.response?.data?.message ||
                    "This verification link is invalid or expired."
                );
            } finally {
                setVerifying(false);
            }
        };

        verifyUserEmail();
    }, [token]);
    
    // =====================================
    // EMAIL VALIDATION
    // =====================================

    const validateEmail = () => {

        const cleanEmail = email.trim();


        if (!cleanEmail) {

            setError(
                "Please enter your email address."
            );

            return false;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(cleanEmail)) {

            setError(
                "Please enter a valid email address."
            );

            return false;
        }


        return true;
    };


    // =====================================
    // RESEND VERIFICATION EMAIL
    // =====================================

    const resendHandler = async () => {

        if (resending) {
            return;
        }


        setError("");
        setMessage("");


        if (!validateEmail()) {
            return;
        }


        try {

            setResending(true);


            await handleResendEmail(
                email.trim()
            );


            setMessage(
                "Verification email sent successfully. Please check your inbox."
            );


        } catch (error) {

            console.error(
                "Resend verification failed:",
                error
            );


            setError(
                error?.response?.data?.message ||
                "Unable to send verification email. Please try again."
            );


        } finally {

            setResending(false);

        }
    };


    // =====================================
    // VERIFYING TOKEN
    // =====================================

    if (verifying) {

        return (
            <main>

                <div className="verify-email-container">

                    <div className="verify-email-icon">
                        ✉️
                    </div>

                    <h1 className="verify-email-title">
                        Verifying Email
                    </h1>

                    <p className="verify-email-description">
                        Please wait while we verify your email address.
                    </p>

                </div>

            </main>
        );
    }


    // =====================================
    // EMAIL VERIFIED SUCCESSFULLY
    // =====================================

    if (verified) {

        return (
            <main>

                <div className="verify-email-container">

                    <div className="verify-email-icon">
                        ✓
                    </div>


                    <h1 className="verify-email-title">
                        Email Verified
                    </h1>


                    <p className="verify-email-description">
                        Your email address has been verified successfully.
                    </p>


                    {email && (
                        <p className="verify-email-address">
                            {email}
                        </p>
                    )}


                    <p className="verify-email-message">
                        Your account is now ready.
                        You can login to your SkillGaps account.
                    </p>


                    <button
                        type="button"
                        className="verify-email-button"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>


                    <p className="verify-email-login">

                        Already have an account?{" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </p>

                </div>

            </main>
        );
    }


    // =====================================
    // NORMAL PAGE / EXPIRED TOKEN
    // =====================================

    return (
        <main>

            <div className="verify-email-container">

                <div className="verify-email-icon">
                    ✉️
                </div>


                <h1 className="verify-email-title">
                    Verify Your Email
                </h1>


                {!token && (
                    <p className="verify-email-description">
                        Enter your email address and we will
                        send you a verification link.
                    </p>
                )}


                {token && error && (
                    <p className="verify-email-description">
                        Your verification link is invalid or
                        has expired. Enter your email below to
                        receive a new verification link.
                    </p>
                )}


                {/* =========================
                    ERROR
                ========================= */}

                {error && (
                    <p className="verify-email-error">
                        {error}
                    </p>
                )}


                {/* =========================
                    SUCCESS MESSAGE
                ========================= */}

                {message && (
                    <p className="verify-email-success">
                        {message}
                    </p>
                )}


                {/* =========================
                    EMAIL INPUT
                ========================= */}

                <div className="input-group">

                    <label htmlFor="verify-email">
                        Email
                    </label>


                    <input
                        id="verify-email"
                        name="email"
                        type="email"
                        className="verify-email-input"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                            setMessage("");
                        }}
                        placeholder="Enter your email"
                        autoComplete="email"
                    />

                </div>


                {/* =========================
                    RESEND BUTTON
                ========================= */}

                <button
                    type="button"
                    className="verify-email-button"
                    onClick={resendHandler}
                    disabled={resending}
                >

                    {resending
                        ? "Sending..."
                        : "Send Verification Email"
                    }

                </button>


                {/* =========================
                    LOGIN
                ========================= */}

                <p className="verify-email-login">

                    Already verified?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </main>
    );
};


export default VerifyEmail;