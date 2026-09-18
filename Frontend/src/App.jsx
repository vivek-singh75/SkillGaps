import React from 'react'
import {RouterProvider} from "react-router-dom";
import { router } from './App.routes.jsx';
import { AuthProvider } from './Features/auth/services/auth.context.jsx';
import { InterviewProvider } from "./Features/interview/Interview.context.jsx"


const App = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App