import React, { useState } from "react";
import "./components/registerFP.css";
import { database } from "../../Components/firebase";
import { ref, push, child, update } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import ParticlesBg from "particles-bg";
import BackButton from "../BackButton";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationText, setRegistrationText] = useState("");
  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();

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

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    let obj = {
      email: email,
      password: password,
    };
    try {
      const res = await axios.post("http://localhost:5000/register", obj);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };
  // const handleSubmit = () => {
  //   if (password !== confirmPassword) {
  //     setRegistrationText("Passwords do not match!");
  //     return;
  //   }
  //   let obj = {
  //     email: email,
  //     password: password,
  //   };
  //   const newPostKey = push(child(ref(database), "users")).key;
  //   const updates = {};
  //   updates["/" + newPostKey] = obj;
  //   setRegistrationText("Registration successful!");
  //   return update(ref(database), updates);
  // };

  return (
    <div className="auth-container">
      <ParticlesBg type="cobweb" bg={true} />

      <div style={{ position: "absolute", top: 50, left: 50 }}>
        <BackButton handleBack={handleBack} arrowColor={"#EEE"} color={"black"}></BackButton>
      </div>

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
              type={!passwordVisible ? "password" : "text"}
              id="password"
              value={password}
              minLength={8}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="password">Password</label>
            <div
              style={{ position: "absolute", right: 10, top: 10 }}
              onClick={() => {
                setPasswordVisible(!passwordVisible);
              }}
            >
              {passwordVisible ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
            </div>
          </div>
          <div className="input-box">
            <i className="fas fa-lock icon"></i>
            <input
              className="form__input"
              type={!confirmPasswordVisible ? "password" : "text"}
              id="confirmPassword"
              value={confirmPassword}
              minLength={8}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="password">Confirm Password</label>
            <div
              style={{ position: "absolute", right: 10, top: 10 }}
              onClick={() => {
                setConfirmPasswordVisible(!confirmPasswordVisible);
              }}
            >
              {confirmPasswordVisible ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
            </div>
          </div>
          <button onClick={handleSubmit} type="submit" className="btn">
            Register
          </button>
          <div className="signup-link">
            <p>
              Have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
        {registrationText && <p style={{ textAlign: "center", marginTop: "20px" }}>{registrationText}</p>}
      </div>
    </div>
  );
}

export default Register;
