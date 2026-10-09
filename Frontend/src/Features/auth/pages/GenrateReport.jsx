import React, { useState, useRef, useEffect } from "react";
import "../../../style/Generate.Report.style.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loadingAnimation/Loading.jsx";

const Home = () => {

  const {
    loading,
    generateReport,
    getReports
  } = useInterview();

  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [allData, setAllData] = useState([]);

  // Resume states
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const resume = useRef(null);


  // ==============================
  // FILE VALIDATION
  // ==============================

  const validateResume = (file) => {

    if (!file) {
      return false;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF or DOCX files are allowed.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return false;
    }

    return true;
  };


  // ==============================
  // HANDLE FILE SELECT
  // ==============================

  const handleResumeChange = (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!validateResume(file)) {
      e.target.value = "";
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };


  // ==============================
  // DRAG OVER
  // ==============================

  const handleDragOver = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
  };


  // ==============================
  // DRAG LEAVE
  // ==============================

  const handleDragLeave = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  };


  // ==============================
  // DROP FILE
  // ==============================

  const handleDrop = (e) => {

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    if (!file) {
      return;
    }

    if (!validateResume(file)) {
      return;
    }

    setResumeFile(file);

    /*
      Important:
      Dropped file ko actual input ke andar bhi set kar rahe hain.
      Isse agar kahin aur resume.current.files use ho,
      to dropped file bhi available rahegi.
    */

    if (resume.current) {

      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(file);

      resume.current.files = dataTransfer.files;
    }
  };


  // ==============================
  // GENERATE INTERVIEW REPORT
  // ==============================

  const handleInterviewReports = async (e) => {

    e.preventDefault();

    // Double submit prevent
    if (loading) {
      return;
    }

    /*
      Resume OR Self Description required
    */

    if (!resumeFile && !selfDescription.trim()) {

      alert(
        "Please upload a resume or enter your self-description."
      );

      return;
    }


    try {

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile
      });

      /*
        Report generate hone ke baad
        specific report page par navigate
      */

      navigate(`/interview/${data._id}`);

    } catch (error) {

      console.error(
        "Generate interview report error:",
        error
      );

      alert(
        "Failed to generate interview report. Please try again."
      );
    }
  };


  // ==============================
  // GET RECENT REPORTS
  // ==============================

  useEffect(() => {

    const showRecentReports = async () => {

      try {

        const data = await getReports();

        setAllData(data?.reportData || []);

      } catch (error) {

        console.log(
          `Error while fetching all data ${error}`
        );
      }
    };

    showRecentReports();

  }, []);


  // ==============================
  // OPEN RECENT REPORT
  // ==============================

  const showRecentReport = (reportId) => {

    if (!reportId) {
      console.log("Report ID not available");
      return;
    }

    navigate(`/interview/${reportId}`);
  };


  // ==============================
  // LOADING SCREEN
  // ==============================

  if (loading) {

    return (
      <main>
        <Loading />
      </main>
    );
  }


  // ==============================
  // UI
  // ==============================

  return (

    <main className="interview-page">

      <div className="interview-wrapper">

        <div className="interview-header">

          <h1>
            Create Your Custom <span>Interview Plan</span>
          </h1>

          <p>
            Let our AI analyze the job requirements and your unique profile
            to build a winning strategy.
          </p>

        </div>


        {/* ==============================
            INTERVIEW FORM
        ============================== */}

        <form
          className="interview-card"
          onSubmit={handleInterviewReports}
        >


          {/* ==============================
              LEFT SIDE
          ============================== */}

          <section className="job-panel">

            <div className="panel-title">

              <div className="title-icon">
                ▣
              </div>

              <h2>
                Target Job Description
              </h2>

              <span>
                Required
              </span>

            </div>


            <div className="job-input-wrapper">

              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                placeholder={`Paste the full job description here...
                    e.g. "Senior Frontend Engineer at Google requires
                    proficiency in React, TypeScript and large-scale system
                    design..."`}
                maxLength={5000}
                required
              />

              <small>
                {jobDescription.length} / 5000 chars
              </small>

            </div>

          </section>



          {/* ==============================
              RIGHT SIDE
          ============================== */}

          <section className="profile-panel">


            <div className="panel-title profile-title">

              <div className="title-icon">
                ♟
              </div>

              <h2>
                Your Profile
              </h2>

            </div>



            {/* ==============================
                RESUME
            ============================== */}

            <div className="resume-area">

              <label>
                Upload Resume <em>(Best Results)</em>
              </label>


              <label
                htmlFor="resume"
                className={`resume-drop ${
                  isDragging ? "dragging" : ""
                }`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >


                <div className="upload-symbol">
                  ↑
                </div>


                <strong>

                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload or drag & drop"}

                </strong>


                <small>
                  PDF or DOCX (Max 5MB)
                </small>


                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.docx"
                  ref={resume}
                  onChange={handleResumeChange}
                />

              </label>

            </div>



            {/* ==============================
                OR
            ============================== */}

            <div className="separator">

              <span>
                OR
              </span>

            </div>



            {/* ==============================
                SELF DESCRIPTION
            ============================== */}

            <div className="description-area">

              <label htmlFor="self-description">
                Quick Self-Description
              </label>


              <textarea
                id="self-description"
                value={selfDescription}
                onChange={(e) =>
                  setSelfDescription(e.target.value)
                }
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />

            </div>



            {/* ==============================
                INFO
            ============================== */}

            <div className="info-message">

              <div>
                i
              </div>

              <p>

                Either a <b>Resume</b> or a{" "}
                <b>Self Description</b> is required to generate a
                personalized plan.

              </p>

            </div>

          </section>



          {/* ==============================
              FOOTER
          ============================== */}

          <div className="card-footer">

            <div className="generation-info">

              AI-Powered Strategy Generation

              <span>
                • Approx 30s
              </span>

            </div>


            <button
              type="submit"
              className="generate-action"
              disabled={loading}
            >

              ✨ Generate My Interview Strategy

            </button>

          </div>

        </form>



        {/* ==============================
            RECENT REPORTS
        ============================== */}

        <footer className="recent-report">

          <h2 className="recent-heading">
            My Recent interview Plans
          </h2>


          <div className="report-card">

            {
              allData.map((report) => (

                <button
                  type="button"
                  key={report._id}
                  onClick={() =>
                    showRecentReport(report._id)
                  }
                >

                  <h2>
                    {report.title}
                  </h2>


                  <p>

                    Generation time{" "}

                    {new Date(
                      report.createdAt
                    ).toLocaleDateString()}

                  </p>


                  <h3>

                    Match Score{" "}

                    <span>
                      {report.matchScore}%
                    </span>

                  </h3>

                </button>

              ))
            }

          </div>

        </footer>

      </div>

    </main>
  );
};

export default Home;