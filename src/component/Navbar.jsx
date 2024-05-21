import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { CgDarkMode } from "react-icons/cg";
import { CiLight } from "react-icons/ci";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../App";
const Navbar = ({ setDarkTheme }) => {
  const darkTheme = useContext(ThemeContext);
  const toggleTheme = () => {
    setDarkTheme((prevDarkTheme) => !prevDarkTheme);
    console.log(darkTheme);
  };
  const darkModeBackground = () => {
    return darkTheme
      ? "bg-gray-500 py-4 border-b border-white-500"
      : "bg-blue-500 py-4 border-b border-white-500";
  };
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-yellow-500 px-3 py-2 mx-2 rounded-md text-sm font-semibold"
      : "text-white hover:bg-blue-900 mx-2 px-3 py-2 rounded-md text-sm font-medium";

  return (
    <>
      <nav className={darkModeBackground()}>
        <div className="flex justify-between items-center px-6 lg:px-8">
          <NavLink to="/" className="text-white font-bold text-xl ">
            Todo App
          </NavLink>

          <div className="flex">
            <div className="ml-10 ">
              <div className="flex items-center">
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/add-task" className={linkClass}>
                  Add Task
                </NavLink>
              </div>
            </div>
            <div className="rounded-full p-1 hover:bg-white">
              {darkTheme ? (
                <CgDarkMode size={30} onClick={toggleTheme} />
              ) : (
                <CiLight size={30} onClick={toggleTheme} />
              )}
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
