import { createHashRouter } from "react-router-dom";

import Login from "./Features/auth/pages/Login.jsx";
import Register from "./Features/auth/pages/Register.jsx";
import Protected from "./Features/auth/components/Protected.jsx";
import MainLayout from "./Features/auth/components/MainLayout.jsx";

import GenerateReport from "./Features/auth/pages/GenrateReport.jsx";
import Interview from "./Features/auth/pages/Interview.jsx";
import ResumeGenerator from "./Features/auth/pages/ResumeGenerator.jsx";
import Dashboard from "./Features/auth/pages/Dashboard.jsx";
import AllReports from "./Features/auth/pages/AllReports.jsx";


export const router = createHashRouter([

  // =========================
  // PUBLIC ROUTES
  // =========================

  {
    path: "/login",
    element: <Login/>
  },

  {
    path: "/register",
    element: <Register />
  },


  // =========================
  // PROTECTED ROUTES
  // =========================

  {
    path: "/",
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),

    children: [

      {
        index: true,
        element: <Dashboard />
      },

      {
        path: "generate-Report",
        element: <GenerateReport />
      },

      {
        path: "all-report",
        element: <AllReports />
      },

      {
        path: "interview/:interviewId",
        element: <Interview />
      },

      {
        path: "resume/download",
        element: <ResumeGenerator />
      }

    ]
  }

]);