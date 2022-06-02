import "./App.css";
import Dashboard from "./Components/Dashboard";
import LandingPage from "./Components/LandingPage";
import ReactGA from "react-ga";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  //Google Analytics Initialization
  ReactGA.initialize("UA-230152920-1");
  const TRACKING_ID = "UA-230152920-1";
  ReactGA.initialize(TRACKING_ID);
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/Dashboard" element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
