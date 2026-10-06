import React, { useState, useEffect } from "react";

import "../../../style/interview.scss";

import { useInterview } from "../hooks/useInterview.js";

import { useParams } from "react-router-dom";


const InterviewReport = () => {

    const [activeSection, setActiveSection] = useState("technical");

    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const { interviewId } = useParams();

    const { report, getReportById } = useInterview();


    // ================= GET REPORT =================

    useEffect(() => {

        if (interviewId) {
            getReportById(interviewId);
        }

    }, [interviewId]);


    // ================= TOGGLE QUESTION =================

    const toggleQuestion = (id) => {

        setExpandedQuestion(
            expandedQuestion === id
                ? null
                : id
        );

    };


    // ================= RENDER QUESTIONS =================

const renderQuestions = (questions, type) => {
          return (

              <div className="questions-wrapper">

                  {questions.map((item, index) => {

                      const questionId = `${type}-${index}`;

                      const isExpanded =
                          expandedQuestion === questionId;


                      return (

                          <div
                              className={`question-item ${
                                  isExpanded
                                      ? "expanded"
                                      : ""
                              }`}
                              key={questionId}
                          >

                              {/* ================= QUESTION HEADER ================= */}

                              <button
                                  type="button"
                                  className="question-header"
                                  onClick={() =>
                                      toggleQuestion(questionId)
                                  }
                              >

                                  <div className="question-number">
                                      Q{index + 1}
                                  </div>


                                  <div className="question-text">
                                      {item.question}
                                  </div>


                                  <span
                                      className={`dropdown-icon ${
                                          isExpanded
                                              ? "open"
                                              : ""
                                      }`}
                                  >
                                      ⌄
                                  </span>

                              </button>


                              {/* ================= QUESTION ANSWER ================= */}

                              <div
                                  className={`question-answer ${
                                      isExpanded
                                          ? "visible"
                                          : ""
                                  }`}
                              >

                                  <div className="answer-container">

                                      {/* ================= INTENTION ================= */}

                                      <div className="answer-section">

                                          <span className="answer-label intention">
                                              INTENTION
                                          </span>

                                          <p>
                                              {item.intention}
                                          </p>

                                      </div>


                                      {/* ================= MODEL ANSWER ================= */}

                                      <div className="answer-section">

                                          <span className="answer-label model">
                                              MODEL ANSWER
                                          </span>

                                          <p>
                                              {item.answer}
                                          </p>

                                      </div>

                                  </div>

                              </div>

                          </div>

                      );

                  })}

              </div>

          );
      };
      

    return (

        <main className="interview-report">

            <div className="report-shell">


                {/* =====================================================
                    LEFT SECTION
                ===================================================== */}

                <aside className="left-panel">


                    <div className="navigation-title">
                        SECTIONS
                    </div>


                    <nav className="section-navigation">


                        {/* ================= TECHNICAL ================= */}

                        <button
                            className={
                                activeSection === "technical"
                                    ? "navigation-item active"
                                    : "navigation-item"
                            }
                            onClick={() => {

                                setActiveSection("technical");

                                setExpandedQuestion(null);

                            }}
                        >

                            <span className="nav-number">
                                01
                            </span>

                            <span>
                                Technical Questions
                            </span>

                        </button>


                        {/* ================= BEHAVIORAL ================= */}

                        <button
                            className={
                                activeSection === "behavioral"
                                    ? "navigation-item active"
                                    : "navigation-item"
                            }
                            onClick={() => {

                                setActiveSection("behavioral");

                                setExpandedQuestion(null);

                            }}
                        >

                            <span className="nav-number">
                                02
                            </span>

                            <span>
                                Behavioral Questions
                            </span>

                        </button>


                        {/* ================= ROADMAP ================= */}

                        <button
                            className={
                                activeSection === "roadmap"
                                    ? "navigation-item active"
                                    : "navigation-item"
                            }
                            onClick={() => {

                                setActiveSection("roadmap");

                                setExpandedQuestion(null);

                            }}
                        >

                            <span className="nav-number">
                                03
                            </span>

                            <span>
                                Preparation Roadmap
                            </span>

                        </button>


                    </nav>

                </aside>


                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <section className="content-panel">


                    {/* ================= CONTENT HEADING ================= */}

                    <header className="content-heading">


                        {/* ================= TECHNICAL ================= */}

                        {activeSection === "technical" && (

                            <>

                                <div>

                                    <span className="section-label">
                                        01 / TECHNICAL
                                    </span>

                                    <h1>
                                        Technical Questions
                                    </h1>

                                </div>


                                <span className="question-count">

                                    {report?.technicalQuestion?.length || 0}

                                    {" "}

                                    questions

                                </span>

                            </>

                        )}


                        {/* ================= BEHAVIORAL ================= */}

                        {activeSection === "behavioral" && (

                            <>

                                <div>

                                    <span className="section-label">
                                        02 / BEHAVIORAL
                                    </span>

                                    <h1>
                                        Behavioral Questions
                                    </h1>

                                </div>


                                <span className="question-count">

                                    {report?.behavioralQuestion?.length || 0}

                                    {" "}

                                    questions

                                </span>

                            </>

                        )}


                        {/* ================= ROADMAP ================= */}

                        {activeSection === "roadmap" && (

                            <>

                                <div>

                                    <span className="section-label">
                                        03 / PREPARATION
                                    </span>

                                    <h1>
                                        Preparation Roadmap
                                    </h1>

                                </div>


                                <span className="question-count">

                                    {report?.preparationPlan?.length || 0}

                                    {" "}

                                    days

                                </span>

                            </>

                        )}

                    </header>


                    <div className="heading-line" />


                    {/* =====================================================
                        TECHNICAL QUESTIONS
                    ===================================================== */}

                    {activeSection === "technical" &&

                        renderQuestions(
                            report?.technicalQuestion || [],
                            "technical"
                        )

                    }


                    {/* =====================================================
                        BEHAVIORAL QUESTIONS
                    ===================================================== */}

                    {activeSection === "behavioral" &&

                        renderQuestions(
                            report?.behavioralQuestion || [],
                            "behavioral"
                        )

                    }


                    {/* =====================================================
                        PREPARATION ROADMAP
                    ===================================================== */}

                    {activeSection === "roadmap" && (

                        <div className="roadmap-wrapper">

                            {report?.preparationPlan?.map(
                                (item) => (

                                    <div
                                        className="roadmap-item"
                                        key={item.day}
                                    >

                                        <div className="roadmap-marker">

                                            {String(item.day).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>


                                        <div className="roadmap-details">

                                            <span>
                                                DAY {item.day}
                                            </span>


                                            <h2>
                                                {item.focus}
                                            </h2>


                                            <ul>

                                                {item.tasks?.map(
                                                    (task, index) => (

                                                        <li
                                                            key={index}
                                                        >
                                                            {task}
                                                        </li>

                                                    )
                                                )}

                                            </ul>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* =====================================================
                    RIGHT PANEL
                ===================================================== */}

                <aside className="right-panel">


                    {/* ================= MATCH SCORE ================= */}

                    <div className="score-heading">
                        MATCH SCORE
                    </div>


                    <div className="score-circle">

                        <strong>
                            {report?.matchScore || 0}
                        </strong>

                        <span>
                            %
                        </span>

                    </div>


                    <div className="score-message">
                        Profile analysis complete
                    </div>


                    <div className="right-divider" />


                    {/* ================= SKILL GAPS ================= */}

                    <div className="skills-heading">
                        SKILL GAPS
                    </div>


                    <div className="skill-list">

                        {report?.skillGap?.map(
                            (skill, index) => (

                                <div
                                    className={`skill-tag ${skill.severity}`}
                                    key={index}
                                >
                                    {skill.skills}
                                </div>

                            )
                        )}
                    </div>
                </aside>
            </div>
        </main>

    );

};


export default InterviewReport;