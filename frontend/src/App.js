import "./App.css";
import UploadFile from "./Components/UploadFile";
import Navbar from 'react-bootstrap/Navbar'
function App() {
  return (
    <div>
      <Navbar style={{paddingLeft: "30px"}} bg="dark" variant="dark">
          <Navbar.Brand>Data Visualization Tool</Navbar.Brand>
      </Navbar>
  
      <UploadFile />
    </div>
  );
}

export default App;
