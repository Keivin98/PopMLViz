import React, { useState } from "react";
import "./components/LoginFP.css";
import { database } from "../../Components/firebase";
import { ref, push, child, update } from "firebase/database";
import { Link } from "react-router-dom";
import ParticlesBg from "particles-bg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginText, setLoginText] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = () => {
    let obj = {
      email: email,
      password: password,
    };
    const newPostKey = push(child(ref(database), "posts")).key;
    const updates = {};
    updates["/" + newPostKey] = obj;
    setLoginText("Welcome!");
    return update(ref(database), updates);
  };

  return (
    <>
      <ParticlesBg type="cobweb" bg={true} />

      <div className="wrapper">
        <form>
          <h1>Login</h1>
          <div className="input-box">
            <i className="fas fa-user icon"></i>
            <input 
              type="email"
              id="email"
              className="form__input"
              value={email}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-box">
            <i className="fas fa-lock icon"></i>
            <input
              className="form__input"
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="forgot-password">
            <a href="#">Forgot Password</a>
          </div>
          <button onClick={handleSubmit} type="submit" className="btn">
            Login
          </button>
          <div className="signup-link">
            <p>Don't Have an account? <Link to="/register">Register</Link></p>
          </div>
        </form>
        {loginText && <p style={{ textAlign: "center", marginTop: "20px" }}>{loginText}</p>}
      </div>
    </>
  );
}

export default Login;