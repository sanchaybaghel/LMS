import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../../Components/Educator/NavBar";
import { Sidebar } from "../../Components/Educator/Sidebar";
import { Footers } from "../../Components/Educator/Footers";

export const Educator = () => {
  return (
    <div className="text-xl min-h-screen bg-white flex flex-col">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
      <Footers />
    </div>
  );
};
