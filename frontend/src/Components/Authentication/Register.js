import React, { useState } from "react";
import "./components/registerFP.css";
import { database } from "../../Components/firebase";
import { ref, push, child, update } from "firebase/database";
import { Link } from "react-router-dom";
import ParticlesBg from "particles-bg";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationText, setRegistrationText] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setRegistrationText("Passwords do not match!");
      return;
    }
    let obj = {
      email: email,
      password: password,
    };
    const newPostKey = push(child(ref(database), "users")).key;
    const updates = {};
    updates["/" + newPostKey] = obj;
    setRegistrationText("Registration successful!");
    return update(ref(database), updates);
  };

  return (
    <>
      <ParticlesBg type="cobweb" bg={true} />

      <div className="wrapper">
        <form>
          <h1>Register</h1>
          <div className="input-box">
            <i className="fas fa-envelope icon"></i>
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
          <div className="input-box">
            <i className="fas fa-lock icon"></i>
            <input
              className="form__input"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          <button onClick={handleSubmit} type="submit" className="btn">
            Register
          </button>
          <div className="signup-link">
            <p>Have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
        {registrationText && <p style={{ textAlign: "center", marginTop: "20px" }}>{registrationText}</p>}
      </div>
    </>
  );
}

export default Register;
