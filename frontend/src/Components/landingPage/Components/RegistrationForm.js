import React, { useState } from "react";
import "../../Authentication/components/RegisterFP.css";
import { database } from "../../../Components/firebase";
import { ref, push, child, update } from "firebase/database";
import { Link } from "react-router-dom";

function RegistrationForm() {
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
    <div className="form">
      <h1 align="center" style={{ fontWeight: "200" }}>
        Register Here
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
        <div className="confirm-password">
          <label className="form__label" style={{ fontWeight: "300" }} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="form__input"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
          />
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleSubmit} type="submit" className="btn">
          Register
        </button>
        <p className="login-link">
          <Link to="/login">I have an account already</Link>
        </p>
      </div>
      {registrationText && <p style={{ textAlign: "center", marginTop: "20px" }}>{registrationText}</p>}
    </div>
  );
}

export default RegistrationForm;
