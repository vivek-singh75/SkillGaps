import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import Loading from "../components/loadingAnimation/Loading";
import "../../../style/Register.scss";



// =====================================
// REGISTER COMPONENT
// =====================================

const Register = () => {

  const {
    loading,
    handleRegister,
    handleResendEmail
  } = useAuth();


  // =====================================
  // REGISTER STATES
  // =====================================

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // =====================================
  // RESEND EMAIL STATES
  // =====================================

  const [showResendPopup, setShowResendPopup] =
    useState(false);

  const [resendEmail, setResendEmail] =
    useState("");

  const [resending, setResending] =
    useState(false);

  const [resendMessage, setResendMessage] =
    useState("");

  const [resendError, setResendError] =
    useState("");

  const [remainingResends, setRemainingResends] =
    useState(3);

  const [cooldown, setCooldown] =
    useState(0);


  // =====================================
  // COOLDOWN TIMER
  // =====================================

  useEffect(() => {

    if (cooldown <= 0) {
      return;
    }


    const timer = setInterval(() => {

      setCooldown((previous) => {

        if (previous <= 1) {

          clearInterval(timer);

          return 0;
        }

        return previous - 1;

      });

    }, 1000);


    return () => {
      clearInterval(timer);
    };

  }, [cooldown]);


  // =====================================
  // REGISTER FORM
  // =====================================

  const formHandler = async (e) => {

    e.preventDefault();


    // Prevent multiple submissions
    if (loading) {
      return;
    }


    // =====================================
    // CLEAN INPUT
    // =====================================

    const cleanUsername =
      username.trim();

    const cleanEmail =
      email.trim();

    const cleanPassword =
      password.trim();


    // =====================================
    // USERNAME VALIDATION
    // =====================================

    if (!cleanUsername) {

      alert(
        "Please enter your username."
      );

      return;
    }


    if (cleanUsername.length < 3) {

      alert(
        "Username must be at least 3 characters."
      );

      return;
    }


    if (cleanUsername.length > 20) {

      alert(
        "Username must not exceed 20 characters."
      );

      return;
    }


    // =====================================
    // EMAIL VALIDATION
    // =====================================

    if (!cleanEmail) {

      alert(
        "Please enter your email."
      );

      return;
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(cleanEmail)) {

      alert(
        "Please enter a valid email address."
      );

      return;
    }


    // =====================================
    // PASSWORD VALIDATION
    // =====================================

    if (!cleanPassword) {

      alert(
        "Please enter your password."
      );

      return;
    }


    if (cleanPassword.length < 6) {

      alert(
        "Password must be at least 6 characters."
      );

      return;
    }


    // =====================================
    // REGISTER
    // =====================================

    try {

      await handleRegister({

        username: cleanUsername,

        email: cleanEmail,

        password: cleanPassword

      });


      /*
        Registration successful.

        User ko login page par nahi bhejenge,
        kyunki email verification abhi pending hai.
      */

      alert(
        "Account created successfully. Please check your email and verify your account."
      );


    } catch (error) {

      console.error(
        "Registration failed:",
        error
      );


      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again."
      );
    }
  };


  // =====================================
  // OPEN RESEND POPUP
  // =====================================

  const openResendPopup = () => {

    // Automatically use email from register form
    setResendEmail(email);

    // Clear previous messages
    setResendMessage("");
    setResendError("");

    setShowResendPopup(true);
  };


  // =====================================
  // CLOSE RESEND POPUP
  // =====================================

  const closeResendPopup = () => {

    if (resending) {
      return;
    }

    setShowResendPopup(false);

    setResendMessage("");
    setResendError("");
  };


  // =====================================
  // RESEND EMAIL
  // =====================================

  const resendHandler = async (e) => {

    e.preventDefault();


    // Prevent multiple clicks
    if (resending) {
      return;
    }


    // Cooldown active
    if (cooldown > 0) {
      return;
    }


    // No resend attempts remaining
    if (remainingResends <= 0) {

      setResendError(
        "You have reached the maximum resend limit."
      );

      return;
    }


    // Clear old messages
    setResendMessage("");
    setResendError("");


    // =====================================
    // CLEAN EMAIL
    // =====================================

    const cleanEmail =
      resendEmail.trim();


    // =====================================
    // EMAIL VALIDATION
    // =====================================

    if (!cleanEmail) {

      setResendError(
        "Please enter your email address."
      );

      return;
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(cleanEmail)) {

      setResendError(
        "Please enter a valid email address."
      );

      return;
    }


    // =====================================
    // SEND REQUEST
    // =====================================

    try {

      setResending(true);


      const response =
        await handleResendEmail(
          cleanEmail
        );


      // =====================================
      // SUCCESS
      // =====================================

      setResendMessage(
        response?.message ||
        "Verification email sent successfully."
      );


      // Update remaining resend count
      if (
        typeof response?.remainingResends ===
        "number"
      ) {

        setRemainingResends(
          response.remainingResends
        );

      } else {

        setRemainingResends(
          (previous) =>
            Math.max(previous - 1, 0)
        );
      }


      // Start 60 second cooldown
      setCooldown(
        response?.cooldownSeconds || 60
      );


    } catch (error) {

      console.error(
        "Resend email failed:",
        error
      );


      const errorData =
        error?.response?.data;


      setResendError(
        errorData?.message ||
        "Unable to send verification email. Please try again."
      );


      // Backend may send remaining cooldown
      if (
        typeof errorData?.remainingSeconds ===
        "number"
      ) {

        setCooldown(
          errorData.remainingSeconds
        );
      }


      // Backend may send remaining resend count
      if (
        typeof errorData?.remainingResends ===
        "number"
      ) {

        setRemainingResends(
          errorData.remainingResends
        );
      }


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


        {/* =================================
            HEADING
        ================================= */}

        <h1 className="top-heading">
          Register
        </h1>


        {/* =================================
            REGISTER FORM
        ================================= */}

        <form onSubmit={formHandler}>


          {/* ===============================
              USERNAME
          =============================== */}

          <div className="input-group">

            <label htmlFor="username">
              Username
            </label>


            <input
              id="username"
              name="username"
              type="text"

              value={username}

              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }

              placeholder="Enter your username"

              autoComplete="username"

              minLength={3}

              maxLength={30}

              required
            />

          </div>


          {/* ===============================
              EMAIL
          =============================== */}

          <div className="input-group">

            <label htmlFor="email">
              Email
            </label>


            <input
              id="email"
              name="email"
              type="email"

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

              placeholder="Enter your email"

              autoComplete="email"

              required
            />

          </div>


          {/* ===============================
              PASSWORD
          =============================== */}

          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>


            <input
              id="password"
              name="password"
              type="password"

              value={password}

              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }

              placeholder="Enter your Password"

              autoComplete="new-password"

              minLength={6}

              required
            />

          </div>


          {/* ===============================
              REGISTER BUTTON
          =============================== */}

          <button
            type="submit"

            className="button primary-button"

            disabled={loading}
          >
            Register
          </button>

        </form>


        {/* =================================
            RESEND EMAIL
        ================================= */}

        <div className="resend-section">

          <p>
            Didn't receive the verification email?
          </p>


          <button
            type="button"

            className="resend-email-button"

            onClick={openResendPopup}
          >
            Resend Verification Email
          </button>

        </div>


        {/* =================================
            LOGIN
        ================================= */}

        <p>

          Already have an Account{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>


      {/* ===================================
          RESEND EMAIL MODAL
      =================================== */}

      {showResendPopup && (

        <div
          className="resend-modal-overlay"

          onMouseDown={(e) => {

            /*
              Close modal when clicking outside
            */

            if (
              e.target ===
              e.currentTarget
            ) {

              closeResendPopup();

            }

          }}
        >

          <div className="resend-modal">


            {/* ===============================
                CLOSE BUTTON
            =============================== */}

            <button
              type="button"

              className="modal-close"

              onClick={closeResendPopup}

              disabled={resending}
            >
              ×
            </button>


            {/* ===============================
                HEADING
            =============================== */}

            <h2>
              Resend Verification Email
            </h2>


            <p>
              Enter your email address to
              receive a new verification link.
            </p>


            {/* ===============================
                RESEND FORM
            =============================== */}

            <form onSubmit={resendHandler}>


              {/* =============================
                  EMAIL
              ============================= */}

              <div className="input-group">

                <label htmlFor="resend-email">
                  Email
                </label>


                <input
                  id="resend-email"

                  name="resend-email"

                  type="email"

                  value={resendEmail}

                  onChange={(e) => {

                    setResendEmail(
                      e.target.value
                    );

                    setResendError("");

                    setResendMessage("");

                  }}

                  placeholder="Enter your email"

                  autoComplete="email"

                  required
                />

              </div>


              {/* =============================
                  ERROR
              ============================= */}

              {resendError && (

                <p className="resend-error">
                  {resendError}
                </p>

              )}


              {/* =============================
                  SUCCESS
              ============================= */}

              {resendMessage && (

                <p className="resend-success">
                  {resendMessage}
                </p>

              )}


              {/* =============================
                  REMAINING RESENDS
              ============================= */}

              <p className="resend-limit">

                Resends remaining:{" "}

                <strong>
                  {remainingResends}
                </strong>

              </p>


              {/* =============================
                  COOLDOWN
              ============================= */}

              {cooldown > 0 && (

                <p className="resend-cooldown">

                  You can resend again in{" "}

                  <strong>
                    {cooldown}s
                  </strong>

                </p>

              )}


              {/* =============================
                  SEND BUTTON
              ============================= */}

              <button
                type="submit"

                className="button primary-button"

                disabled={
                  resending ||
                  cooldown > 0 ||
                  remainingResends <= 0
                }
              >

                {resending

                  ? "Sending..."

                  : cooldown > 0

                    ? `Resend in ${cooldown}s`

                    : remainingResends <= 0

                      ? "Resend Limit Reached"

                      : "Send Verification Email"

                }

              </button>

            </form>

          </div>

        </div>

      )}

    </main>
  );
};


export default Register;