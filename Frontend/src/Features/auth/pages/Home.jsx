import React, { useState , useRef, useEffect } from "react";
import "../../../style/Home.style.scss";
import { useInterview } from "../hooks/useInterview.js"
import { useNavigate } from 'react-router-dom';   



const Home = () => {

  const { loading , reports,  generateReport ,getReportById , getReports} = useInterview();

  const navigate = useNavigate()

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [allData, setAllData] = useState([])
  const resume = useRef();


  const handleInterviewReports = async ()=>{
    const resumeFile = resume.current.files[0]
    try {
      const data = await generateReport({jobDescription , selfDescription , resumeFile});

      navigate(`/interview/${ data._id }`) 

    } catch (error) {

      return <main><h2>Failed ,  Try Again </h2></main>
    }
  }

 useEffect(()=>{
    const showRecentReports = async () =>{
      try {
        const data = await getReports();
        setAllData(data)
           
      } catch (error) {
        console.log(`Error while fetching all data ${error}`)
      }
    }
    showRecentReports()


  } , [])
  

  if(loading ){
    return <main>
            <h1>Loading Your Report...</h1>
          </main>
  }
  

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

        <div className="interview-card">

          {/* LEFT SIDE */}
          <section className="job-panel">

            <div className="panel-title">
              <div className="title-icon">▣</div>

              <h2>Target Job Description</h2>

              <span>Required</span>
            </div>

            <div className="job-input-wrapper">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={`Paste the full job description here...
                    e.g. "Senior Frontend Engineer at Google requires
                    proficiency in React, TypeScript and large-scale system
                    design..."`}
                maxLength={5000}
              />

              <small>
                {jobDescription.length} / 5000 chars
              </small>
            </div>

          </section>


          {/* RIGHT SIDE */}
          <section className="profile-panel">

            <div className="panel-title profile-title">
              <div className="title-icon">♟</div>

              <h2>Your Profile</h2>
            </div>


            {/* RESUME */}
            <div className="resume-area">

              <label>
                Upload Resume <em>(Best Results)</em>
              </label>

              <label
                htmlFor="resume"
                className="resume-drop"
              >

                <div className="upload-symbol">
                  ↑
                </div>

                <strong>
                  {resume
                    ? resume.name
                    : "Click to upload or drag & drop"}
                </strong>

                <small>
                  PDF or DOCX (Max 5MB)
                </small>

                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.docx"
                  ref= {resume}
                />

              </label>

            </div>


            <div className="separator">
              <span>OR</span>
            </div>


            {/* SELF DESCRIPTION */}
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


            {/* INFO */}
            <div className="info-message">

              <div>i</div>

              <p>
                Either a <b>Resume</b> or a{" "}
                <b>Self Description</b> is required to generate a
                personalized plan.
              </p>

            </div>

          </section>


          {/* FOOTER */}
          <div className="card-footer">

            <div className="generation-info">
              AI-Powered Strategy Generation
              <span>• Approx 30s</span>
            </div>

            <button
              type="button"
              className="generate-action"
              onClick={handleInterviewReports}
            >
              ✨ Generate My Interview Strategy
            </button>

          </div>

        </div>
        <footer className="recent-report">
          <h2 className="recent-heading">My Recent interview Plans</h2>
            <div className="report-card">
              {
                allData.map((report)=>(
                  <button key={report._id}>
                    <h2>{report.title}</h2>
                    <p>Generation time{" "}
                    {new Date(report.createdAt).toLocaleDateString()}</p>
                    <h3>Match Score <span>{report.matchScore}%</span></h3>
                  </button>
                ))}   
                 
            </div>
        </footer>

      </div>
    </main>
  );
};

export default Home;