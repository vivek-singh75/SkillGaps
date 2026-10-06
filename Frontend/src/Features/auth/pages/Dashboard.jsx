import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../services/auth.context";

import "../../../style/Dashboard.scss";

const Dashboard = () => {

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);


    const handleProtectedNavigation = (path) => {

        if (!user) {
            navigate("/login");
            return;
        }

        navigate(path);
    };


    return (

        <div className="dashboard">


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

                                <span>
                                    →
                                </span>

                            </button>


                            <button
                                className="secondary-action"
                                onClick={() =>
                                    handleProtectedNavigation(
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

                        <span>
                            →
                        </span>

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


        </div>
    );
};


export default Dashboard;