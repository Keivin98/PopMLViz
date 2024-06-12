// import Dashboard from "./archive/Dashboard";
import Dashboard from "./Components/Dashboard/Dashboard";
import LandingPage from "./Components/landingPage/LandingPage";
import Login from "../src/Components/Authentication/Login";
import Register from "../src/Components/Authentication/Register";
import ReactGA from "react-ga";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  //Google Analytics Initialization
  ReactGA.initialize("UA-230152920-1");
  const TRACKING_ID = "UA-230152920-1";
  ReactGA.initialize(TRACKING_ID);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register></Register>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
