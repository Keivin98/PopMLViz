import Dashboard from "./Components/Dashboard/Dashboard";
import LandingPage from "./Components/landingPage/LandingPage";
import Login from "../src/Components/Authentication/Login";
import Register from "../src/Components/Authentication/Register";
import FAQ from "./Components/landingPage/Components/Help";
import ReactGA from "react-ga";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tutorial from "./Components/landingPage/Components/Tutorial";

function App() {
  //Google Analytics Initialization
  const TRACKING_ID = "UA-230152920-1";
  ReactGA.initialize(TRACKING_ID);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/tutorial" element={<Tutorial />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;