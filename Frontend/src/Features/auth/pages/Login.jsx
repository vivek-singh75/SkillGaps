
import React, { useState } from "react";
import axios from "axios";
import "../form.style.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/loadingAnimation/Loading";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
    const navigate = useNavigate();
    const { loading, startButtonLoading,
        stopButtonLoading, isButtonLoading ,
          handleLogin ,handleVerifyEmailForOTP ,
          handleVerifyOTPAuth ,handleResendOTP ,
          handleUpdatePassword} = useAuth();

    // Login states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Password reset states
    const [showResetOTP, setShowResetOTP] = useState(false);
    const [resetStep, setResetStep] = useState("email");

    const [resendEmail, setResendEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Keep the short-lived reset token in component memory
    const [resetToken, setResetToken] = useState("");

    // UI states
    const [resending, setResending] = useState(false);
    const [resetError, setResetError] = useState("");
    const [resetMessage, setResetMessage] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Common API error handler
    const getErrorMessage = (error, fallback) => {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            fallback
        );
    };

    // =====================================
    // LOGIN
    // =====================================

    const formHandler = async (e) => {
        e.preventDefault();

        if (loading) return;

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        if (!cleanEmail) {
            alert("Please enter your email.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!cleanPassword) {
            alert("Please enter your password.");
            return;
        }

        if (cleanPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        try {
            await handleLogin({
                email: cleanEmail,
                password: cleanPassword
            });

            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);

            alert(
                getErrorMessage(
                    error,
                    "Login failed. Please check your email and password."
                )
            );
        }
    };

    const handleShowPass = () => {
        setShowPassword((prev) => !prev);
    };

    // =====================================
    // OPEN / CLOSE RESET MODAL
    // =====================================

    const openResendPopup = () => {
        setResendEmail(email.trim());
        setResetStep("email");

        setOtp("");
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");

        setResetError("");
        setResetMessage("");

        setShowResetOTP(true);
    };

    const closeResendPopup = () => {
        if (resending) return;

        setShowResetOTP(false);
        setResetStep("email");

        setOtp("");
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");

        setResetError("");
        setResetMessage("");
    };

    // =====================================
    // STEP 1: SEND OTP
    // =====================================

    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (resending) return;

        const cleanEmail = resendEmail.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            setResetError("Please enter a valid email address.");
            return;
        }

        try {
            setResending(true);
            setResetError("");
            setResetMessage("");

            const response = await handleVerifyEmailForOTP( cleanEmail );

            const result = response;

            if (result?.success === false) {
                throw new Error(
                    result.message || "Unable to send OTP."
                );
            }

            setResetStep("otp");

            setResetMessage(
                result?.message ||
                "OTP has been sent to your email."
            );

        } catch (error) {
            console.error("Send OTP failed:", error);

            setResetError(
                getErrorMessage(
                    error,
                    "Unable to send OTP. Please try again."
                )
            );

        } finally {
            setResending(false);
        }
    };

    // =====================================
    // STEP 2: VERIFY OTP
    // =====================================

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (resending) return;

        if (!/^\d{4}$/.test(otp)) {
            setResetError("Please enter a valid 4-digit OTP.");
            return;
        }

        try {
            setResending(true);
            setResetError("");
            setResetMessage("");

            const result = await handleVerifyOTPAuth(resendEmail.trim(), otp );

            console.log(result)

            if (result?.success !== true) {
                throw new Error(
                    result?.message || "Invalid or expired OTP."
                );
            }

            // Support the API response token inside data or at root.
            const token =
                result?.resetToken ||
                result?.data?.resetToken ||
                result?.accessToken ||
                result?.data?.resetToken;

            console.log(token)


            if (!token) {
                throw new Error(
                    "OTP verified, but reset token was not received from the server."
                );
            }

            setResetToken(token);
            setResetStep("password");

            setOtp("");
            setResetMessage(
                result?.message ||
                "OTP verified successfully. You can now set a new password."
            );

        } catch (error) {
            console.error("OTP verification failed:", error);

            setResetError(
                getErrorMessage(
                    error,
                    "OTP verification failed. Please try again."
                )
            );

        } finally {
            setResending(false);
        }
    };

    // =====================================
    // STEP 3: CHANGE PASSWORD
    // =====================================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (resending) return;

        if (!resetToken) {
            setResetError(
                "Your reset session has expired. Please request a new OTP."
            );
            setResetStep("email");
            return;
        }

        if (newPassword.length < 6) {
            setResetError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setResetError(
                "New password and confirm password do not match."
            );
            return;
        }

        try {
            setResending(true);
            setResetError("");
            setResetMessage("");

            console.log(resetToken)

            const response = await handleUpdatePassword(  resetToken, resendEmail.trim() , newPassword)

            const result = response;

            if (result?.success !== true) {
                throw new Error(
                    result?.message || "Password could not be changed."
                );
            }

            setResetMessage(
                result?.message ||
                "Password changed successfully. You can now login."
            );

            // Clear sensitive values
            setResetToken("");
            setNewPassword("");
            setConfirmPassword("");
            setOtp("");

            // Show success message before closing
            setResetStep("success");

        } catch (error) {
            console.error("Password reset failed:", error);

            setResetError(
                getErrorMessage(
                    error,
                    "Unable to change password. Please try again."
                )
            );

        } finally {
            setResending(false);
        }
    };

    // =====================================
    // LOADING
    // =====================================

    if (loading) {
        return (
            <main>
                <Loading />
            </main>
        );
    }

    // =====================================
    // UI
    // =====================================

    return (
        <main>
            <div className="form-Container">

                <h1 className="top-heading">
                    Login
                </h1>

                <form onSubmit={formHandler}>

                    {/* EMAIL */}

                    <div className="input-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    {/* PASSWORD */}

                    <div className="input-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password"
                            autoComplete="current-password"
                            minLength={6}
                            required
                        />

                        <button
                            type="button"
                            className="showHide"
                            onClick={handleShowPass}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="button primary-button"
                        disabled={loading}
                    >
                        Login
                    </button>

                </form>

                <p className="login-page-buttons">

                    <Link to="/register">
                        Create Account
                    </Link>

                    <button
                        type="button"
                        className="popUp-Button"
                        onClick={openResendPopup}
                    >
                        Forgot Password?
                    </button>

                </p>

            </div>

            {/* =====================================
                PASSWORD RESET MODAL
            ===================================== */}

            {showResetOTP && (
                <section
                    className="reset-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeResendPopup();
                        }
                    }}
                >

                    <div
                        className="reset-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reset-modal-title"
                    >

                        <button
                            type="button"
                            className="reset-modal-close"
                            onClick={closeResendPopup}
                            disabled={resending}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        {/* STEP INDICATOR */}

                        <div className="reset-modal-header">
                            <div className="reset-modal-icon">
                                {resetStep === "success" ? "✓" : "🔐"}
                            </div>

                            <h2 id="reset-modal-title">
                                {resetStep === "email" && "Reset Password"}
                                {resetStep === "otp" && "Verify OTP"}
                                {resetStep === "password" && "Create New Password"}
                                {resetStep === "success" && "Password Updated"}
                            </h2>

                            <p>
                                {resetStep === "email" &&
                                    "Enter your registered email address. We'll send you a verification code."}

                                {resetStep === "otp" &&
                                    `Enter the 4-digit code sent to ${resendEmail}.`}

                                {resetStep === "password" &&
                                    "Your email is verified. Create a strong new password."}

                                {resetStep === "success" &&
                                    "Your password has been changed successfully. You can now login."}
                            </p>
                        </div>

                        {/* ERROR */}

                        {resetError && (
                            <div className="reset-alert reset-error" role="alert">
                                {resetError}
                            </div>
                        )}

                        {/* SUCCESS MESSAGE */}

                        {resetMessage && resetStep !== "success" && (
                            <div className="reset-alert reset-success" role="status">
                                {resetMessage}
                            </div>
                        )}

                        {/* STEP 1: EMAIL */}

                        {resetStep === "email" && (
                            <form onSubmit={handleSendOTP}>

                                <div className="reset-input-group">
                                    <label htmlFor="reset-email">
                                        Email Address
                                    </label>

                                    <input
                                        id="reset-email"
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={resendEmail}
                                        onChange={(e) => {
                                            setResendEmail(e.target.value);
                                            setResetError("");
                                        }}
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="reset-submit-button"
                                    disabled={resending}
                                >
                                    {resending ? "Sending OTP..." : "Send OTP"}
                                </button>

                            </form>
                        )}

                        {/* STEP 2: OTP */}

                        {resetStep === "otp" && (
                            <form onSubmit={handleVerifyOTP}>

                                <div className="reset-input-group">
                                    <label htmlFor="reset-otp">
                                        4-Digit Verification Code
                                    </label>

                                    <input
                                        id="reset-otp"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        placeholder="Enter 4-digit OTP"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 4);

                                            setOtp(value);
                                            setResetError("");
                                        }}
                                        maxLength={4}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="reset-submit-button"
                                    disabled={resending || otp.length !== 4}
                                >
                                    {resending ? "Verifying..." : "Verify OTP"}
                                </button>

                                <button
                                    type="button"
                                    className="reset-text-button"
                                    onClick={() => {
                                        setResetStep("email");
                                        setOtp("");
                                        setResetError("");
                                        setResetMessage("");
                                    }}
                                    disabled={resending}
                                >
                                    Change email address
                                </button>

                            </form>
                        )}

                        {/* STEP 3: NEW PASSWORD */}

                        {resetStep === "password" && (
                            <form onSubmit={handleChangePassword}>

                                <div className="reset-input-group">
                                    <label htmlFor="new-password">
                                        New Password
                                    </label>

                                    <div className="reset-password-wrapper">
                                        <input
                                            id="new-password"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setResetError("");
                                            }}
                                            minLength={6}
                                            autoComplete="new-password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword((prev) => !prev)
                                            }
                                        >
                                            {showNewPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div className="reset-input-group">
                                    <label htmlFor="confirm-password">
                                        Confirm Password
                                    </label>

                                    <div className="reset-password-wrapper">
                                        <input
                                            id="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                setResetError("");
                                            }}
                                            minLength={6}
                                            autoComplete="new-password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword((prev) => !prev)
                                            }
                                        >
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                {confirmPassword.length > 0 && (
                                    <p
                                        className={
                                            newPassword === confirmPassword
                                                ? "reset-password-match"
                                                : "reset-password-mismatch"
                                        }
                                    >
                                        {newPassword === confirmPassword
                                            ? "✓ Passwords match"
                                            : "Passwords do not match"}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="reset-submit-button"
                                    disabled={
                                        resending ||
                                        !newPassword ||
                                        !confirmPassword ||
                                        newPassword !== confirmPassword
                                    }
                                >
                                    {resending ? "Updating Password..." : "Change Password"}
                                </button>

                            </form>
                        )}

                        {/* STEP 4: SUCCESS */}

                        {resetStep === "success" && (
                            <button
                                type="button"
                                className="reset-submit-button"
                                onClick={closeResendPopup}
                            >
                                Back to Login
                            </button>
                        )}

                        {resetStep !== "success" && (
                            <button
                                type="button"
                                className="reset-cancel-button"
                                onClick={closeResendPopup}
                                disabled={resending}
                            >
                                Cancel
                            </button>
                        )}

                    </div>
                </section>
            )}

        </main>
    );
};

export default Login;
