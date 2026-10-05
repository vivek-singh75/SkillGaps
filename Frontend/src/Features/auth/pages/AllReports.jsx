import React from "react";
import "../../../style/AllReport.scss";

const AllReports = () => {
  const reports = [
    {
      id: 1,
      name: "Vivek Singh",
      title: "Software Developer",
      score: 85,
      createdAt: "2026-09-13T10:53:14.183Z"
    },
    {
      id: 2,
      name: "Vivek Singh",
      title: "Full Stack Developer",
      score: 78,
      createdAt: "2026-09-13T10:53:14.183Z"

    },
    {
      id: 3,
      name: "Vivek Singh",
      title: "React Developer",
      score: 91,
      createdAt: "2026-09-13T10:53:14.183Z"

    },
  ];

  //const reports = 


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
          <div className="inner_box" key={report.id}>
            <div className="report_info">
              <div className="namedate">
                <h3 className="name">{report.name}</h3>
                <p className="createdAt">
                  Created At <br />
                  <span>
                    {new Date(report.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
          

              <div className="title">
                {report.title}
              </div>
            </div>

            <div className="score_box">
              <span className="score_label">Match Score</span>
              <span className="score">{report.score}%</span>
            </div>

            <button className="view_btn">
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllReports;
