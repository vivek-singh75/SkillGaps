import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Loading from "./loadingAnimation/Loading";

const Protected = ({ children }) => {

    const { loading, user } = useAuth();

    if (loading) {
        return (
            <main>
                <Loading />
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Protected;