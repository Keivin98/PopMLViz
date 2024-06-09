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

      <div className="form">
        <h1 align="center" style={{ fontWeight: "200" }}>
          Login Here
        </h1>
        <div className="form-body" style={{ justifyContent: "center" }}>
          <div className="email">
            <label className="form__label" style={{ fontWeight: "300" }} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form__input"
              value={email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>
          <div className="password">
            <label className="form__label" style={{ fontWeight: "300" }} htmlFor="password">
              Password
            </label>
            <input
              className="form__input"
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handleSubmit} type="submit" className="btn">
            Login
          </button>
          <p className="register-link">
            <Link to="/register">Register if you do not have an account already</Link>
          </p>
        </div>
        {loginText && <p style={{ textAlign: "center", marginTop: "20px" }}>{loginText}</p>}
      </div>
    </>
  );
}

export default Login;
