import { createHashRouter } from "react-router-dom";
import Login from "./Features/auth/pages/Login.jsx";
import Register from "./Features/auth/pages/Register.jsx";
import Protected from "./Features/auth/components/Protected.jsx";
import GenerateReport from "./Features/auth/pages/GenrateReport.jsx";
import Interview from "./Features/auth/pages/Interview.jsx";
import ResumeGenerator from "./Features/auth/pages/ResumeGenerator.jsx";
import Dashboard from "./Features/auth/pages/Dashboard.jsx";
import AllReports from "./Features/auth/pages/AllReports.jsx";

export const router = createHashRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },

    {
        path: "/",
        element: (
            <Dashboard />
        )
    },
    {
        path: "/generate-Report",
        element: (
            <Protected>
                <GenerateReport />
            </Protected>
        )
    },
    {
        path: "/all-report",
        element: (
            <Protected>
                <AllReports />
            </Protected>
        )
    },
    {
        path: "/interview/:interviewId",
        element: (
            <Protected>
                <Interview />
            </Protected>
        )
    },
    {
        path: "/resume/download",
        element: (
            <Protected>
                <ResumeGenerator />
            </Protected>
        )
    }
]);