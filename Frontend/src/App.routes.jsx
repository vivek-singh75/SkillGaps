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
import Profile from "./Features/auth/pages/Profile.jsx";

import  Navbar   from "./Features/auth/components/navbar/Navbar.jsx"


export const router = createHashRouter([

  // ==========================================
  // PUBLIC
  // ==========================================

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  // ==========================================
  // PUBLIC DASHBOARD + NAVBAR
  // ==========================================

  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Dashboard />
      </>
    ),
  },

  // ==========================================
  // PROTECTED
  // ==========================================

  {
    path: "/generate-Report",
    element: (
      <Protected>
        <MainLayout>
          <GenerateReport />
        </MainLayout>
      </Protected>
    ),
  },

  {
    path: "/all-report",
    element: (
      <Protected>
        <MainLayout>
          <AllReports />
        </MainLayout>
      </Protected>
    ),
  },

  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <MainLayout>
          <Interview />
        </MainLayout>
      </Protected>
    ),
  },

  {
    path: "/resume/download",
    element: (
      <Protected>
        <MainLayout>
          <ResumeGenerator />
        </MainLayout>
      </Protected>
    ),
  },
 {
  path: "/profile",
  element: (
    <Protected>
      <MainLayout>
        <Profile />
      </MainLayout>
    </Protected>
  ),
},

]);