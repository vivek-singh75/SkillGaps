import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Button loaders
    const [buttonLoaders, setButtonLoaders] = useState({});

    const startButtonLoading = (key) => {
        setButtonLoaders(prev => ({
            ...prev,
            [key]: true
        }));
    };

    const stopButtonLoading = (key) => {
        setButtonLoaders(prev => ({
            ...prev,
            [key]: false
        }));
    };

    const isButtonLoading = (key) => {
        return !!buttonLoaders[key];
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,

                startButtonLoading,
                stopButtonLoading,
                isButtonLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};