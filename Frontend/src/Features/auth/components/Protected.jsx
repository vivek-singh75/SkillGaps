import React, { Children, use } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom';


const Protected = ({children}) => {   // this was created to prevent access the of some page without login
  
   const {loading ,  user} = useAuth();

   if(loading){
    return(<main><h1>Loading...</h1></main>)         //wrap the which wee want to prevent unauthorize access
   } 
   if(!user){
        return <Navigate to = {"/login"}/>
   }
   return children
}

export default Protected