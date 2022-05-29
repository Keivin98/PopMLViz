import "./App.css";
import ReactGA from "react-ga";
import Dashboard from "./Components/Dashboard";
import LandingPage from "./Components/LandingPage";
import Navbar from "react-bootstrap/Navbar";






function App() {  
  
  //Google Analytics Initialization
  ReactGA.initialize("UA-230152920-1");
  const TRACKING_ID = "UA-230152920-1";
  ReactGA.initialize(TRACKING_ID);
  
  return (
    <div>
      {/* <Navbar
        style={{
          position: "fixed",
          height: "6%",
          width: "100%",
          paddingLeft: "45%",
          backgroundColor: "#3b3f4e",
        }}
      >
        <Navbar.Brand style={{ color: "white" }}>
          PopMLViz
          <img
            src="./logo.jpeg"
            style={{ width: "6%", position: "fixed", left: "7%", top: "1%" }}
          />
        </Navbar.Brand>
      </Navbar> */}

      {/* <Dashboard /> */}
      
      <LandingPage/>
    </div>
  );
} 


export default App;
