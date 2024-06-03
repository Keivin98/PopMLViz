import React, { useState } from "react";
import ParticlesBg from "particles-bg";
import useAnalyticsEventTracker from "../../useAnalyticsEventTracker";
import { FaPlayCircle } from "react-icons/fa";
import "./headerFP.css";
import logo from "../../../assets/logo.jpeg";
import PopMLvis from "../../../assets/PopMLvis.pdf";
import LoginForm from "./LoginForm";

function Header(props) {
  const [showLogin, setShowLogin] = useState(false);
  const gaEventTracker = useAnalyticsEventTracker("social");

  const name = "A better way to analyze population genetics.";
  const bio =
    "Visualize population genetic datasets interactively with PopMLvis, using dimensionality reduction algorithms, machine learning models, and statistical measurements.";

  // const handleLoginClick = () => {
  //   setShowLogin(true);
  // };

  // const handleCloseLogin = () => {
  //   setShowLogin(false);
  // };

  return (
    <header id="home">
      <ParticlesBg type="cobweb" bg={true} />

      <nav id="nav-wrap">
        <div className="nav-left">
          <img src={logo} alt="PopMLVis Logo" className="logo" />
          <span className="site-name">PopMLVis</span>
        </div>
        <ul id="nav" className="nav">
          <li>
            <a href={PopMLvis} target="_blank" rel="noopener noreferrer">
              Docs
            </a>
          </li>
          <li>
            <a href="https://github.com/qcri/QCAI-PopMLVis" target="_blank" rel="noopener noreferrer">
              Github
            </a>
          </li>
          <li>
            <a className="smoothscroll" href="#faq">
              FAQ
            </a>
          </li>
        </ul>
        <div className="nav-right">
          <a href="/login" className="button btn login-btn">
            Login
          </a>
          {/* <button className="button btn login-btn" onClick={handleLoginClick}>
            Login
          </button> */}
        </div>
      </nav>

      <div className="row banner">
        <div className="banner-text">
          <h1
            className="responsive-headline"
            style={{
              fontFamily: "Arial Black",
              color: "#071b52",
              fontSize: "60px", // Adjusted size for smaller header
            }}
          >
            {name}
          </h1>
          <mark
            style={{
              fontWeight: "200",
              fontSize: "24px",
              backgroundColor: "rgba(255,255,255,0.7)",
              color: "black",
            }}
          >
            {bio}
          </mark>
          <hr />

          <ul className="social">
            <a href={"/Dashboard"} className="button btn project-btn" onClick={() => gaEventTracker("Live")}>
              <FaPlayCircle /> Start Visualizing
            </a>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
