import React from "react";
import MotivationBanner from "../component/MotivationBanner";
import { ToastContainer } from "react-toastify";
import TaskList from "../component/TaskList";
import "react-toastify/dist/ReactToastify.css";
const HomePage = () => {
  return (
    <>
      <MotivationBanner />
      <TaskList />
      <ToastContainer />
    </>
  );
};

export default HomePage;
