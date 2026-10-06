import "./Navbar.scss";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../services/auth.context";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Navbar = () => {
  const { user, handleLogout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const isInterviewPage = location.pathname.startsWith("/interview/");

  const handleResume = () => {
    setMenuOpen(false);
    navigate("/resume/download");
  };

  const handleLogoutFunction = async () => {
    try {
      await handleLogout();

      setShowLogoutPopup(false);
      setMenuOpen(false);

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="dashboard-navbar">

        {/* ================= BRAND ================= */}
        <Link
          to="/"
          className="dashboard-brand"
          onClick={closeMenu}
        >
          <div className="brand-logo">
            SG
          </div>

          <div className="brand-info">
            <h1>SkillGaps</h1>
            <span>AI CAREER PREP</span>
          </div>
        </Link>


        {/* ================= DESKTOP NAV LINKS ================= */}
        <div className="dashboard-nav-links">

          <Link
            to="/"
            className="nav-link"
          >
            Home
          </Link>

          <Link
            to="/generate-Report"
            className="nav-link"
          >
            Generate Report
          </Link>

          <Link
            to="/all-report"
            className="nav-link"
          >
            My Reports
          </Link>

        </div>


        {/* ================= AUTH SECTION ================= */}
        <div className="dashboard-auth">

          {/* Generate Resume */}
          {isInterviewPage && (
            <button
              type="button"
              className="navbar-resume-btn"
              onClick={handleResume}
            >
              <span className="resume-icon">
                ✦
              </span>

              <span>
                Generate Resume
              </span>
            </button>
          )}


          {/* ================= LOGGED OUT ================= */}
          {!user && (
            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>
          )}


          {/* ================= LOGGED IN ================= */}
          {user && (
            <>
              <div className="user-info">

                <div className="user-avatar">
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <span className="user-name">
                  {user.username}
                </span>

              </div>

              <button
                type="button"
                className="logout-btn"
                onClick={() => setShowLogoutPopup(true)}
              >
                Logout
              </button>
            </>
          )}


          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>


        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div className="mobile-menu">

            <Link
              to="/"
              onClick={closeMenu}
            >
              Home
            </Link>

            <Link
              to="/generate-Report"
              onClick={closeMenu}
            >
              Generate Report
            </Link>

            <Link
              to="/all-report"
              onClick={closeMenu}
            >
              My Reports
            </Link>

            {user && (
              <button
                type="button"
                className="mobile-logout-btn"
                onClick={() => {
                  setMenuOpen(false);
                  setShowLogoutPopup(true);
                }}
              >
                Logout
              </button>
            )}

            {!user && (
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}

          </div>
        )}

      </nav>


      {/* ================= LOGOUT POPUP ================= */}
      {showLogoutPopup && (
        <div className="logout-overlay">

          <div className="logout-popup">

            <h3>
              Logout?
            </h3>

            <p>
              Are you sure you want to logout?
            </p>

            <div className="logout-popup-actions">

              <button
                type="button"
                className="cancel-logout"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-logout"
                onClick={handleLogoutFunction}
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Navbar;