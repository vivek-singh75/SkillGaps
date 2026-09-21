import React, { useState } from "react";
import { generateTargetedResume } from "../services/resume.api";
import "../../../style/resumeGenerator.scss";
import Loading from "../components/loadingAnimation/Loading";

const ResumeGenerator = () => {

    const [loading , setLoading] = useState(false);
    const [error, setError] = useState("");

   

    const handleGenerateResume = async () => {

        try {

            setLoading(true);
            setError("");

            const pdfBlob = await generateTargetedResume();

            const url = window.URL.createObjectURL(pdfBlob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "targeted-resume.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Error generating targeted resume:",
                error
            );

            setError(
                "Unable to generate resume. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <main className="resume-generator">

            <div className="resume-generator-container">

                <div className="resume-generator-header">

                    <h1>
                        AI Resume Generator
                    </h1>

                    <p>
                        Create a job-targeted resume from your
                        existing interview profile.
                    </p>

                </div>


                <div className="resume-generator-card">

                    <div className="resume-info">

                        <div className="resume-icon">
                            📄
                        </div>

                        <div>
                            <h2>
                                Generate Your Targeted Resume
                            </h2>

                            <p>
                                Your resume, job description and
                                self-description from your interview
                                report will automatically be used.
                            </p>
                        </div>

                    </div>


                    <div className="resume-features">

                        <div className="feature">
                            <span>✓</span>
                            Existing resume
                        </div>

                        <div className="feature">
                            <span>✓</span>
                            Target job description
                        </div>

                        <div className="feature">
                            <span>✓</span>
                            ATS optimized
                        </div>

                        <div className="feature">
                            <span>✓</span>
                            PDF format
                        </div>

                    </div>


                    {error && (
                        <div className="resume-error">
                            {error}
                        </div>
                    )}


                    <button
                        className="generate-resume-btn"
                        onClick={handleGenerateResume}
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className="loader"></span>
                               {<Loading label="Generating..."/>}
                            </>
                        ) : (
                            "Generate Targeted Resume"
                        )}

                    </button>

                </div>

            </div>

        </main>
    );
};

export default ResumeGenerator;