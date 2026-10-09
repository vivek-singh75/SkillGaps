import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/loadingAnimation/Loading";

const Register = () => {

  const navigate = useNavigate();

  const {
    loading,
    handleRegister
  } = useAuth();


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const formHandler = async (e) => {

    e.preventDefault();

    // Prevent multiple submissions
    if (loading) {
      return;
    }


    // Remove accidental spaces
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();


    // =========================
    // USERNAME VALIDATION
    // =========================

    if (!cleanUsername) {
      alert("Please enter your username.");
      return;
    }

    if (cleanUsername.length < 3) {
      alert("Username must be at least 3 characters.");
      return;
    }

    if (cleanUsername.length > 30) {
      alert("Username must not exceed 30 characters.");
      return;
    }


    // =========================
    // EMAIL VALIDATION
    // =========================

    if (!cleanEmail) {
      alert("Please enter your email.");
      return;
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      alert("Please enter a valid email address.");
      return;
    }


    // =========================
    // PASSWORD VALIDATION
    // =========================

    if (!cleanPassword) {
      alert("Please enter your password.");
      return;
    }

    if (cleanPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }


    try {

      await handleRegister({
        username: cleanUsername,
        email: cleanEmail,
        password: cleanPassword
      });


      /*
        Login page par tabhi jayega
        jab registration successfully complete ho.
      */

      navigate("/login");

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


  // =========================
  // LOADING
  // =========================

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
          Register
        </h1>


        <form onSubmit={formHandler}>

          {/* USERNAME */}

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
                setUsername(e.target.value)
              }
              placeholder="Enter your username"
              autoComplete="username"
              minLength={3}
              maxLength={30}
              required
            />

          </div>


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
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your Password"
              autoComplete="new-password"
              minLength={6}
              required
            />

          </div>


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="button primary-button"
            disabled={loading}
          >
            Register
          </button>

        </form>


        <p>
          Already have a Account{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </main>
  );
};


export default Register;