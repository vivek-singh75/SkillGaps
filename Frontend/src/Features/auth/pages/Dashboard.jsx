import React, { useContext , useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/auth.context";
import "../../../style/Dashboard.scss";
import { useAuth } from "../hooks/useAuth";



const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { handleLogout } = useAuth()
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const handleProtectedNavigation = (path) => {
        if (!user) {
            navigate("/login");
            return;
        }

        navigate(path);
    };


    const handleLogoutFunction = async () => {
        try {
            await handleLogout();
            navigate("/login");
        } catch (error) {
            console.log("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
     };

    return (
        <div className="dashboard">

            {/* ================= NAVBAR ================= */}

            <header className="dashboard-navbar">

                <div
                    className="dashboard-brand"
                    onClick={() => navigate("/")}
                >
                    <div className="brand-logo">
                        SG
                    </div>

                    <div className="brand-info">
                        <h2>SkillGaps</h2>
                        <span>AI CAREER PREP</span>
                    </div>
                </div>


                <nav className="dashboard-nav-links">

                    <button
                        className="nav-link active"
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>

                    <button
                        className="nav-link"
                        onClick={() =>
                            handleProtectedNavigation("/generate-report")
                        }
                    >
                        Generate Report
                    </button>

                    <button
                        className="nav-link"
                        onClick={() =>
                            handleProtectedNavigation("/all-report")  //we ahave to create api for it
                        }
                    >
                        My Reports
                    </button>

                </nav>


                <div className="dashboard-auth">

                    {user ? (
                        <>
                            <div className="user-info">

                                <div className="user-avatar">
                                    {user.username
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <span>
                                    {user.username}
                                </span>

                            </div>

                           <button
                                className="logout-btn"
                                onClick={() => setShowLogoutPopup(true)}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="login-btn"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>

                            <button
                                className="register-btn"
                                onClick={() => navigate("/register")}
                            >
                                Create Account
                            </button>
                        </>
                    )}

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className="dashboard-main">


                {/* ================= HERO ================= */}

                <section className="hero-section">

                    <div className="hero-content">

                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            AI-POWERED CAREER PREPARATION
                        </div>


                        <h1>
                            Prepare Smarter.
                            <br />

                            <span>
                                Interview Better.
                            </span>
                        </h1>


                        <p className="hero-description">
                            Analyze your resume against any job description,
                            discover your skill gaps, and prepare for interviews
                            with personalized AI-powered guidance.
                        </p>


                        <div className="hero-actions">

                            <button
                                className="primary-action"
                                onClick={() =>
                                    handleProtectedNavigation(
                                        "/generate-Report"
                                    )
                                }
                            >
                                Generate Interview Report
                                <span>→</span>
                            </button>


                            <button
                                className="secondary-action"
                                onClick={() =>
                                    handleProtectedNavigation(        //need api
                                       "/all-report"
                                    )
                                }
                            >
                                View My Reports
                            </button>

                        </div>

                    </div>

                </section>


                {/* ================= FEATURES ================= */}

                <section className="features-section">

                    <div className="section-heading">

                        <span>
                            WHAT SKILLGAPS OFFERS
                        </span>

                        <h2>
                            Everything you need to prepare
                        </h2>

                        <p>
                            One platform to understand the job,
                            improve your skills, and prepare for the interview.
                        </p>

                    </div>


                    <div className="features-grid">


                        <article className="feature-card">

                            <div className="feature-icon">
                                ✦
                            </div>

                            <h3>
                                AI Job Analysis
                            </h3>

                            <p>
                                Compare your resume and profile
                                against a specific job description
                                using AI.
                            </p>

                        </article>


                        <article className="feature-card">

                            <div className="feature-icon">
                                ◇
                            </div>

                            <h3>
                                Skill Gap Analysis
                            </h3>

                            <p>
                                Discover the skills you already have
                                and identify the areas you need
                                to improve.
                            </p>

                        </article>


                        <article className="feature-card">

                            <div className="feature-icon">
                                ◎
                            </div>

                            <h3>
                                Interview Preparation
                            </h3>

                            <p>
                                Get personalized technical and
                                behavioral questions based on
                                your target role.
                            </p>

                        </article>


                        <article className="feature-card">

                            <div className="feature-icon">
                                ◈
                            </div>

                            <h3>
                                Targeted Resume
                            </h3>

                            <p>
                                Generate a resume tailored to
                                the requirements of a specific
                                job.
                            </p>

                        </article>


                    </div>

                </section>


                {/* ================= CTA ================= */}

                <section className="bottom-cta">

                    <div className="cta-content">

                        <span>
                            READY TO GET STARTED?
                        </span>

                        <h2>
                            Turn your preparation into progress.
                        </h2>

                        <p>
                            Create your personalized interview
                            preparation report and start preparing.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            handleProtectedNavigation(
                                "/generate-Report"
                            )
                        }
                    >
                        Start Preparing
                        <span>→</span>
                    </button>

                </section>


            </main>


            {/* ================= FOOTER ================= */}

            <footer className="dashboard-footer">

                <span>
                    © {new Date().getFullYear()} SkillGaps
                </span>

                <span>
                    AI-powered interview preparation
                </span>

            </footer>

                    {/* This code is part of logout button */}


        {showLogoutPopup && (
            <div
                className="logout-modal-overlay"
                onClick={() => setShowLogoutPopup(false)}
            >
                <div
                    className="logout-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="logout-modal-icon">
                        !
                    </div>

                    <h2>Logout?</h2>

                    <p>
                        Are you sure you want to logout from SkillGaps?
                    </p>

                    <div className="logout-modal-actions">

                        <button
                            className="cancel-logout-btn"
                            onClick={() => setShowLogoutPopup(false)}
                        >
                            Cancel
                        </button>

                        <button
                            className="confirm-logout-btn"
                            onClick={handleLogoutFunction}
                        >
                            Confirm
                        </button>

                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

export default Dashboard;