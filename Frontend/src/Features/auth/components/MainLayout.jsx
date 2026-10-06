import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;