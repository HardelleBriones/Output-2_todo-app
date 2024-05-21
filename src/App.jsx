import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import NewTask from "./component/NewTask";
import React from "react";
import Navbar from "./component/Navbar";
export const ThemeContext = React.createContext();
function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  return (
    <>
      <ThemeContext.Provider value={darkTheme}>
        <Routes>
          <Route path="/" element={<Navbar setDarkTheme={setDarkTheme} />}>
            <Route index element={<HomePage />} />
            <Route path="/add-task" element={<NewTask />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
