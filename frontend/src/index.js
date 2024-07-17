import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./config/AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer></ToastContainer>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
