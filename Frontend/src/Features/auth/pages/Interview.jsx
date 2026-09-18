import React, { useState } from "react";
import "../../../style/interview.scss";
import {useInterview} from "../hooks/useInterview.js"


const InterviewReport = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  //   report = {
  //   matchScore: 85,

  //   technicalQuestion: [
  //     {
  //       question:
  //         "Can you explain how you would implement user authentication in a Node.js and Express application using JWT?",

  //       intention:
  //         "To assess the candidate's understanding of authentication and authorization, which is a key requirement for the role and mentioned in their resume.",

  //       answer:
  //         "To implement JWT authentication, I would first create a user model in MongoDB with a hashed password using bcrypt. When a user logs in, I verify their credentials against the database. If valid, I generate a JSON Web Token using jsonwebtoken containing the user ID and sign it with a secret key. I then send this token back to the client, which stores it in an httpOnly cookie. For protected routes, I would create an Express middleware that extracts the token, verifies it using the secret key, and attaches the decoded user payload to the request object before calling next().",
  //     },

  //     {
  //       question:
  //         "How do you manage state in a React application, and when would you choose Context API versus Redux?",

  //       intention:
  //         "To evaluate frontend proficiency, specifically component state management and architectural decision-making with React.",

  //       answer:
  //         "In React, local component state is managed using the useState hook. For passing data down multiple levels without prop drilling, the Context API is ideal for low-frequency updates like theme preferences or authentication state. However, for complex applications with large amounts of frequently changing global state, Redux Toolkit is preferred because of its predictable state container, robust debugging tools and middleware support for asynchronous actions.",
  //     },

  //     {
  //       question:
  //         "What is the difference between SQL and NoSQL databases, and why did you choose MongoDB for your ShopSphere project?",

  //       intention:
  //         "To test database design concepts and verify the candidate's practical experience with MongoDB.",

  //       answer:
  //         "SQL databases are relational, structured, and use tabular schemas with predefined relationships. NoSQL databases like MongoDB are non-relational, document-oriented and offer flexible schemas using JSON-like BSON documents. I chose MongoDB for ShopSphere because e-commerce applications often deal with varying product attributes, nested categories and cart data that benefit from a flexible structure.",
  //     },
  //   ],

  //   behavioralQuestion: [
  //     {
  //       question:
  //         "Tell me about a time when you were working on a project and faced a technical roadblock. How did you resolve it?",

  //       intention:
  //         "To assess the candidate's problem-solving skills, debugging approach, and resilience when facing challenges.",

  //       answer:
  //         "While building my MERN e-commerce project, ShopSphere, I encountered a persistent CORS error when my React frontend tried to communicate with the Express backend API. I systematically checked the network tab and server logs. I realized the server was missing the cors middleware configuration and had a mismatch in port definitions. I configured it properly with specific origin permissions and updated my environment variables, which resolved the communication issue.",
  //     },

  //     {
  //       question:
  //         "As a fresher with multiple ongoing projects, how do you prioritize your tasks and manage your time effectively?",

  //       intention:
  //         "To evaluate time management, organization, and teamwork capabilities in a fast-paced development environment.",

  //       answer:
  //         "I prioritize my tasks by breaking larger project goals into smaller manageable milestones using a feature-based approach. I use task lists and prioritize features based on core functionality versus nice-to-have enhancements. By setting daily coding goals and dedicating specific blocks of time to frontend, backend, and DSA practice, I ensure steady progress across my commitments.",
  //     },
  //   ],

  //   skillGap: [
  //     {
  //       skills: "Production-grade Authentication and Authorization",
  //       severity: "medium",
  //     },
  //     {
  //       skills: "Advanced State Management and Redux Implementation",
  //       severity: "low",
  //     },
  //     {
  //       skills: "Testing Frameworks (Jest / Mocha)",
  //       severity: "medium",
  //     },
  //   ],

  //   preparationPlan: [
  //     {
  //       day: 1,
  //       focus: "Advanced JavaScript and Asynchronous Programming",
  //       tasks: [
  //         "Revise closures, promises, async/await, and event loops.",
  //         "Practice array manipulation methods and ES6+ features.",
  //       ],
  //     },
  //     {
  //       day: 2,
  //       focus: "React.js Deep Dive and Component Optimization",
  //       tasks: [
  //         "Review hooks (useEffect, useMemo, useCallback) and custom hooks.",
  //         "Practice building reusable components and lifting state up.",
  //       ],
  //     },
  //     {
  //       day: 3,
  //       focus: "Node.js, Express, and RESTful API Architecture",
  //       tasks: [
  //         "Build a sample CRUD API with proper error handling and routing.",
  //         "Implement JWT authentication middleware from scratch.",
  //       ],
  //     },
  //     {
  //       day: 4,
  //       focus: "MongoDB Schema Design and Mongoose Integration",
  //       tasks: [
  //         "Practice designing schemas with references and embedded documents.",
  //         "Write aggregation pipelines and optimize database queries.",
  //       ],
  //     },
  //     {
  //       day: 5,
  //       focus: "Debugging, Git Workflow, and Mock Interview",
  //       tasks: [
  //         "Review common debugging techniques using browser dev tools and console.",
  //         "Practice explaining project architecture and walkthroughs for ShopSphere.",
  //       ],
  //     },
  //   ],
  // };
  
  const {report} = useInterview()


  const toggleQuestion = (id) => {
    setExpandedQuestion(
      expandedQuestion === id ? null : id
    );
  };

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
                isExpanded ? "expanded" : ""
              }`}
              key={questionId}
            >
              {/* QUESTION HEADER */}

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
                    isExpanded ? "open" : ""
                  }`}
                >
                  ⌄
                </span>
              </button>


              {/* DROPDOWN CONTENT */}

              <div
                className={`question-answer ${
                  isExpanded ? "visible" : ""
                }`}
              >
                <div className="answer-container">

                  <div className="answer-section">
                    <span className="answer-label intention">
                      INTENTION
                    </span>

                    <p>
                      {item.intention}
                    </p>
                  </div>


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

        {/* =========================================
            LEFT SECTION
        ========================================= */}

        <aside className="left-panel">

          <div className="brand-area">
            <div className="brand-icon">
              SG
            </div>

            <div>
              <h2>SkillGaps</h2>
              <span>AI INTERVIEW</span>
            </div>
          </div>


          <div className="navigation-title">
            SECTIONS
          </div>


          <nav className="section-navigation">

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


        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <section className="content-panel">

          <header className="content-heading">

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


          {/* TECHNICAL */}

          {activeSection === "technical" &&
            renderQuestions(
              report?.technicalQuestion || [],
              "technical"
            )
          }


          {/* BEHAVIORAL */}

          {activeSection === "behavioral" &&
            renderQuestions(
              report?.behavioralQuestion || [],
              "behavioral"
            )
          }


          {/* ROADMAP */}

          {activeSection === "roadmap" && (

            <div className="roadmap-wrapper">

              {report?.preparationPlan?.map(
                (item) => (

                  <div
                    className="roadmap-item"
                    key={item.day}
                  >

                    <div className="roadmap-marker">
                      {String(item.day).padStart(2, "0")}
                    </div>


                    <div className="roadmap-details">

                      <span>
                        DAY {item.day}
                      </span>

                      <h2>
                        {item.focus}
                      </h2>


                      <ul>

                        {item.tasks.map(
                          (task, index) => (
                            <li key={index}>
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


        {/* =========================================
            RIGHT PANEL
        ========================================= */}

        <aside className="right-panel">

          <div className="score-heading">
            MATCH SCORE
          </div>


          <div className="score-circle">

            <strong>
              {report?.matchScore || 0}
            </strong>

            <span>%</span>

          </div>


          <div className="score-message">
            Profile analysis complete
          </div>


          <div className="right-divider" />


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