import React from "react";
import Navbar from "./navbar/Navbar.jsx";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default MainLayout;