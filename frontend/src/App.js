import "./App.css";
import Dashboard from "./Components/Dashboard";
import Navbar from "react-bootstrap/Navbar";

function App() {
  return (
    <div>
      <Navbar
        style={{
          position: "fixed",
          height: "6%",
          width: "100%",
          paddingLeft: "45%",
          backgroundColor: "#3b3f4e",
        }}
      >
        <Navbar.Brand style={{ color: "white", fontSize: 24 }}>
          PopMLViz
          <img
            src="./logo.jpeg"
            style={{ width: "6%", position: "fixed", left: "7%", top: "1%" }}
          />
        </Navbar.Brand>
      </Navbar>

      <Dashboard />
    </div>
  );
}

export default App;
