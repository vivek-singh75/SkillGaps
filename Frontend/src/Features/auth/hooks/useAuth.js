import { useContext, useEffect } from "react";
import { AuthContext } from "../services/auth.context";

import { register, verifyEmail, resendEmail, login ,
     logout , getMe , deleteAccount, updateUserDetails
      ,updateUserPassword ,resendOTP ,verifyOTP , 
      verifyEmailForOTP ,updatePassword} 
      from "../services/auth.api";


import { useNavigate } from "react-router-dom";

export  const useAuth = ()=>{
    const context = useContext(AuthContext)
    const {user , setUser , loading , setLoading} = context
    const navigate = useNavigate()

    const handleRegister = async ({username ,  email , password}) =>{
        setLoading(true)
        try {
            const data = await register(username , email , password);
            setUser(data.user)
            alert(data.message)

            return data

        } catch (error) {
            console.log(error.message)
            throw error
        } finally{
            setLoading(false)
        }
    }

    const handleVerifyEmail = async (token) => {

        try {

            setLoading(true);

            const response = await verifyEmail(token);

            return response;

        } finally {

            setLoading(false);
        }
    };


   const handleResendEmail = async (email) => {
        try {
            setLoading(true);

            const response = await resendEmail(email);

            return response;

        } finally {
            setLoading(false);
        }
    };

    const handleLogin =async ({email , password})=>{

        setLoading(true);

        try {
            const data = await login(email , password);
            setUser(data.user)
           
        } catch (error) {
            console.log(`login error ${error}`)
            alert("Wrong Email or Password")

        } finally{
            setLoading(false)
        } 
    }
    
    
    useEffect(() => {
        const getUserAndSet = async () => {
            try {
                const data = await getMe();

                if (data?.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }

            } catch (error) {
                console.error("Unexpected error while checking user:", error);
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        getUserAndSet();
    }, []);

    
    const handleLogout = async () =>{
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {
            throw Error("in useAuth logout api give error")
        } finally{
            setLoading(false)
        }       
    }

    const handleUpdateUserDetails = async (updatDetails)=>{

        setLoading(true);
        
        try {
            const data = await updateUserDetails(updatDetails);
            setUser(data.user)
            alert(data.message)
           
        } catch (error) {
            alert(
                error.response?.data?.message || "Something went wrong"
            );

        } finally{
            setLoading(false)
            
        } 
    }


    const handleUpdateUserPassword = async (passwordData)=>{

        setLoading(true);
        
        try {
            const data = await updateUserPassword(passwordData);
  
            alert(data.message)
           
        } catch (error) {
            alert(
                error.response?.data?.message || "Something went wrong"
            );

        } finally{
            setLoading(false)
            
        } 
    }


    const handleDeleteUserAccount = async (deletePassword) => {
        setLoading(true);
        try {
            const data = await deleteAccount(deletePassword);

            setUser(null);

            alert(data.message);

        } catch (error) {

            alert(
                error.response?.data?.message || "Something went wrong"
            );
            throw Error(`delete account give error in useAuth ${error}`);
            
        } finally{
            setLoading(false)
        }
    }

    // =====================
    // for reset password
    // =====================

    const handleVerifyEmailForOTP = async (email) => {

        setLoading(true)

        try {
            const data = await verifyEmailForOTP(email);

            return data
            
        } catch (error) {
            alert(
                error.response?.data?.message || "Something went wrong"
            );
        } finally{
            setLoading(false)
        }

    }


    const handleVerifyOTPAuth = async (email , otp) => {

        setLoading(true)

        try {
            const data = await verifyOTP(email , otp);

            return data
            
        } catch (error) {
            alert(
                error.response?.data?.message || "Something went wrong"
            );
        } finally{
            setLoading(false)
        }

    }


    const handleResendOTP = async (email) => {

        setLoading(true)

        try {
            const data = await resendOTP(email);

            return data
            
        } catch (error) {
            alert(
                error.response?.data?.message || "Something went wrong"
            );
        } finally{
            setLoading(false)
        }

    }


    const handleUpdatePassword = async (resetToken , email , newPassword) => {

        setLoading(true)

        try {
            const data = await updatePassword( resetToken ,email , newPassword);

            return data
            
        } catch (error) {

            alert(
                error.response?.data?.message || "Something went wrong"
            );
        } finally{

            setLoading(false)
        }

    }


    return {user, loading , handleLogin ,
        handleRegister ,handleVerifyEmail, 
        handleResendEmail ,handleLogout ,
        handleUpdateUserDetails,
        handleUpdateUserPassword, 
        handleDeleteUserAccount,
        handleVerifyEmailForOTP,
        handleVerifyOTPAuth,
        handleResendOTP,
        handleUpdatePassword
    }
}




