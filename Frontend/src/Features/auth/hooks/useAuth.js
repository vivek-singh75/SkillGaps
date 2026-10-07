import { useContext, useEffect } from "react";
import { AuthContext } from "../services/auth.context";
import { register, login , logout , getMe , deleteAccount, updateUserDetails ,updateUserPassword} from "../services/auth.api";
import { useNavigate } from "react-router-dom";

export  const useAuth = ()=>{
    const context = useContext(AuthContext)
    const {user , setUser , loading , setLoading} = context
    const navigate = useNavigate()

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
    const handleRegister = async ({username ,  email , password}) =>{
        setLoading(true)
        try {
            const data = await register(username , email , password);
            setUser(data.user)

        } catch (error) {
            
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


    const handleDeleteUserAccount = async (password) => {
        setLoading(true);
        try {
            const data = await deleteAccount(password)
            setUser(null)

        } catch (error) {
            throw Error(`delete account give error in useAuth ${error}`);
            
        } finally{
            setLoading(false)
        }
    }




    return {user, loading , handleLogin ,handleRegister ,handleLogout ,
        handleUpdateUserDetails,handleUpdateUserPassword, handleDeleteUserAccount }
}




