import {createBrowserRouter, Router} from "react-router-dom";
import Login from "./Features/auth/pages/Login.jsx";
import Register from "./Features/auth/pages/Register.jsx";
import Protected from "./Features/auth/components/Protected.jsx";
import Home from "./Features/auth/pages/Home.jsx";
import Interview from "./Features/auth/pages/Interview.jsx"

export const router = createBrowserRouter([
    {
        path : "/login",
        element : <Login/>
    },
    {
        path : "/register",
        element : <Register/>
    },{
        path : "/",
        element : (<Protected>{<Home/>}</Protected>)
    },
    {
        path : "/interview/:interviewId",
        element : (<Protected>{<Interview/>}</Protected>)
    }
])