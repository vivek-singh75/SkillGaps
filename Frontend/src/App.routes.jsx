import {createBrowserRouter, Router} from "react-router-dom";
import Login from "./Features/auth/pages/Login.jsx";
import Register from "./Features/auth/pages/Register.jsx";
import Protected from "./Features/auth/components/Protected.jsx";

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
        element : (<Protected><main><h1>login successfull</h1></main></Protected>)
    }
])