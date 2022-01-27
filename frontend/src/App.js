import { useState, useEffect } from "react";
import "./App.css";
import Main from "./Components/Main";

function App() {
  const [articles, setArticles] = useState([]);


  return (
    <div className="App container m-4">
      <div className="row">
        <div className="text-center">
          <h1>Visualization Project</h1>
        </div>
      </div>

      <Main />
    </div>
  );
}

export default App;
