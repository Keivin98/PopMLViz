import React, { useState } from "react";
import ParticlesBg from "particles-bg";
import useAnalyticsEventTracker from "../../useAnalyticsEventTracker";
import { FaPlayCircle, FaBook, FaGithub } from "react-icons/fa";
import { LiaQuestionSolid } from "react-icons/lia";
import "./headerFP.css";
import logo from "../../../assets/logo.jpeg";
import PopMLvis from "../../../assets/PopMLvis.pdf";
import LoginForm from "./LoginForm";
import colors from "../../../config/colors"; 
import font from "../../../config/font";

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
              fontFamily: font.secondaryFont,
              color: colors.primary,
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
              fontFamily: 'default'
            }}
          >
            {bio}
          </mark>
          <hr />

          <ul className="social">
            <a href={"/Dashboard"} style={{}} className="button btn project-btn" onClick={() => gaEventTracker("Live")}>
              <FaPlayCircle style={{ marginRight: 10 }} /> Start Visualizing
            </a>
            <div className="spcial-btn-container">
              <a
                href={PopMLvis}
                className="button btn FAQ-btn special-btn"
                style={{ color: "white" }}
                onClick={() => gaEventTracker("Docs")}
              >
                <img style={{width:"60px", height:"60px"}} src="/faq.png"></img>
                <div className="button-txt">FAQ</div>
              </a>
              <a
                href={PopMLvis}
                target="_blank"
                rel="noopener noreferrer"
                className="button btn docks-btn special-btn"
                style={{ color: "white" }}
                onClick={() => gaEventTracker("Docs")}
              >
                <FaBook size={35} />
                <div className="button-txt"> Docs</div>
              </a>
              <a
                className="button btn github-btn special-btn"
                href="https://github.com/qcri/QCAI-PopMLVis"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => gaEventTracker("Github")}
              >
                <FaGithub size={35}/>
                <div className="button-txt">Github</div>
              </a>
            </div>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
