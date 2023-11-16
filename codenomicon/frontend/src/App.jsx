import MatrixBackground from "./components/MatrixBackground";
import Header from "./components/Header";
import LoginSignup from "./pages/LoginSignup";
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
    <div>
      <Header />
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="*" element={<Error />} />
        </Routes>
      <div>
      <MatrixBackground />
      </div>
    </div>
    </Router>
  );
}

export default App
