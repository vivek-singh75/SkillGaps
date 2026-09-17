import { useContext, useEffect } from "react";
import { AuthContext } from "../services/auth.context";
import { register, login , logout , getMe } from "../services/auth.api";

export  const useAuth = ()=>{
    const context = useContext(AuthContext)
    const {user , setUser , loading , setLoading} = context

    const handleLogin =async ({email , password})=>{
        setLoading(true);
        try {
            const data = await login(email ,password);
            setUser(data.user)
           
        } catch (error) {
            
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
                setUser(null);
                console.log("user token is not available");
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
            
        } finally{
            setLoading(false)
        }
        
       
    }
    return {user, loading , handleLogin ,handleRegister ,handleLogout }
}




