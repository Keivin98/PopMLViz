import React, { useState } from "react";
import "./components/registerFP.css";
import { database } from "../../Components/firebase";
import { ref, push, child, update } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import ParticlesBg from "particles-bg";
import BackButton from "../BackButton";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios from "axios";
import AppButton from "../AppButton";
import ParticleBackground from "../ParticleBackground";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationText, setRegistrationText] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

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

  // const handleSubmit =()=>{
  //   console.log("registered")
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const obj = { email, password };
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/register`,
        obj,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setIsLoading(false);

      if (response.status === 201) {
        setAccountCreated(true);
        // navigate("/login");
      } else {
        alert("Unexpected response from server: " + response.status);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        // Server responded with an error status code
        if (error.response.status === 409) {
          alert("this email is being used");
        } else {
          alert("Server error! Please check the input and try again. If the error persists, refer to the docs!");
        }
      } else if (error.request) {
        // The request was made but no response was received
        alert("No response from server. Please check your network connection.");
      } else {
        // Something happened in setting up the request that triggered an error
        alert("Unexpected error: " + error.message);
      }
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
      <ParticleBackground></ParticleBackground>

      <div style={{ position: "absolute", top: 50, left: 50 }}>
        <BackButton handleBack={handleBack} arrowColor={"#EEE"} color={"black"}></BackButton>
      </div>
      <div className="wrapper">
        {accountCreated ? (
          <div
            style={{
              padding: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: 30 }}>You are all set!</div>
            <AppButton title={"login"} onClick={() => navigate("/login")}></AppButton>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <h1>Register</h1>
              <div className="input-box">
                <i className="fas fa-envelope icon"></i>
                <input
                  style={{paddingRight: 5}}
                  type="email"
                  id="email"
                  className="form__input"
                  value={email}
                  onChange={handleInputChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                />
                <label className={email || emailFocused ? "focused-textInput" : ""} htmlFor="email">
                  Email
                </label>
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
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                />
                <label className={password || passwordFocused ? "focused-textInput" : ""} htmlFor="password">
                  Password
                </label>
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
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  onChange={handleInputChange}
                  required
                />
                <label
                  className={confirmPassword || confirmPasswordFocused ? "focused-textInput" : ""}
                  htmlFor="password"
                >
                  Confirm Password
                </label>
                <div
                  style={{ position: "absolute", right: 10, top: 10 }}
                  onClick={() => {
                    setConfirmPasswordVisible(!confirmPasswordVisible);
                  }}
                >
                  {confirmPasswordVisible ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                </div>
              </div>
              <button type="submit" className="btn">
                Register
              </button>
              <div className="signup-link">
                <p>
                  Have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
            {registrationText && <p style={{ textAlign: "center", marginTop: "20px" }}>{registrationText}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
