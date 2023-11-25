import MatrixBackground from "./components/MatrixBackground";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/Error";
import RepoPage from "./RepoPage";
import ForgotPassword from "./pages/ForgotPassword";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from 'react';

function App() {
  const [showMatrixRain, setShowMatrixRain] = useState(true);

  const toggleMatrixRain = () => {
    setShowMatrixRain(prev => !prev);
    console.log("click");
  };

  return (
    <Router>
    <div>
      <Header toggleMatrixRain={toggleMatrixRain} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="*" element={<Error />} />
          <Route path="/repo-page" element={<RepoPage />} />
        </Routes>
      <div>
      <MatrixBackground show={showMatrixRain} />
      </div>
    </div>
    </Router>
  );
}

export default App
