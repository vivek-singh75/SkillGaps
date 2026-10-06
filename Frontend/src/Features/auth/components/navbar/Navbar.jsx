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

  // Show Generate Resume only on Interview page
  const isInterviewPage =
    location.pathname.startsWith("/interview/");

  /* =====================================================
     RESUME
  ===================================================== */

  const handleResume = () => {
    setMenuOpen(false);
    navigate("/resume/download");
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogoutFunction = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (error) {
      console.log("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  /* =====================================================
     CLOSE MOBILE MENU
  ===================================================== */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="dashboard-navbar">

        {/* =================================================
            BRAND
        ================================================= */}

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


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

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


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="dashboard-auth">

          {/* Generate Resume
              Only Interview page
              NOT inside dropdown
          */}

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


          {/* User */}

          {user && (
            <div className="user-info">

              <div className="user-avatar">
                {user.username?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <span className="user-name">
                {user.username}
              </span>

            </div>
          )}


          {/* Desktop Logout */}

          {user && (
            <button
              type="button"
              className="logout-btn"
              onClick={() => setShowLogoutPopup(true)}
            >
              Logout
            </button>
          )}


          {/* Mobile / Tablet Hamburger */}

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


        {/* =================================================
            MOBILE / TABLET DROPDOWN

            IMPORTANT:
            Generate Resume is NOT here.
        ================================================= */}

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

          </div>
        )}

      </nav>


      {/* =================================================
          LOGOUT MODAL
      ================================================= */}

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