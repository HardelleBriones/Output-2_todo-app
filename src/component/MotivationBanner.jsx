import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../App";
const MotivationBanner = () => {
  const darkTheme = useContext(ThemeContext);
  const darkMode = () => {
    return darkTheme
      ? "bg-gray-500 py-8 lg:py-12 mb-1"
      : "bg-blue-500 py-8 lg:py-12 mb-1";
  };
  return (
    <>
      <section className={darkMode()}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
            Stay on track, one task at a time
            <span className="block text-sm sm:text-base text-white mt-2">
              Every small action leads to big accomplishments.
            </span>
          </h1>
        </div>
      </section>
    </>
  );
};

export default MotivationBanner;
