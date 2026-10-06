
import React, { useEffect, useState } from "react";
import "../../../style/AllReport.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";

const AllReports = () => {
  const { getReports } = useInterview();

  const navigate = useNavigate()

  const [reports, setReports] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();

        console.log("Reports response:", data);

        setReports(data.reportData || []);
        setUserDetails(data.userDetails || null);
      } catch (error) {
        console.log(`getReports failed: ${error}`);
        setReports([]);
        setUserDetails(null)
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = async()=>{
    try {
      const data  = reports
      
      console.log(`data is ${data}`)
      navigate(`/interview/${ data[0]._id }`) 

    } catch (error) {
      console.log(`error _id not availble ${error}`)
    }

  }

  return (
    <div className="outer_box">
      <div className="header">
        <h2 className="Head">Your All Reports</h2>

        <p className="sub_heading">
          View and manage your previous interview reports
        </p>
      </div>

      <div className="reports_container">

        {reports.map((report) => (
          <div className="inner_box" key={report._id}>

            <div className="report_info">

              <div className="namedate">

                <h3 className="name">
                  {userDetails?.username}
                </h3>

                <p className="createdAt">
                  Created At <br />

                  <span>
                    {new Date(report.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </p>

              </div>

              <div className="title">
                {report.title}
              </div>

            </div>

            <div className="score_box">

              <span className="score_label">
                Match Score
              </span>

              <span className="score">
                {report.matchScore}%
              </span>

            </div>

            <button className="view_btn"
            onClick={handleViewReport}
            >
              View Report
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default AllReports;
