import React from 'react'
import {RouterProvider} from "react-router-dom";
import { router } from './App.routes.jsx';
import { AuthProvider } from './Features/auth/services/auth.contex.jsx';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App