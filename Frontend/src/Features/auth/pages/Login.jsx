import React, { useState } from "react";
import "../form.style.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/loadingAnimation/Loading";

const Login = () => {

  const navigate = useNavigate();

  const { loading, handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const formHandler = async (e) => {

    e.preventDefault();

    // Extra protection
    if (loading) {
      return;
    }

    // Remove accidental spaces
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();


    // Email validation
    if (!cleanEmail) {
      alert("Please enter your email.");
      return;
    }

    // Browser type="email" already validates basic email format,
    // but this gives a clearer message.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      alert("Please enter a valid email address.");
      return;
    }


    // Password validation
    if (!cleanPassword) {
      alert("Please enter your password.");
      return;
    }

    if (cleanPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }


    try {

      const response = await handleLogin({
        email: cleanEmail,
        password: cleanPassword
      });

      /*
        IMPORTANT:

        Navigate only after successful login.

        If handleLogin throws an error,
        this code will go to catch and user will
        remain on the login page.
      */

      navigate("/");

    } catch (error) {

      console.error("Login failed:", error);

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please check your email and password."
      );
    }
  };


  if (loading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }


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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              autoComplete="current-password"
              minLength={6}
              required
            />

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


        <p>
          don't have an Account{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>

    </main>
  );
};

export default Login;