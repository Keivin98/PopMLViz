import React, { useState } from "react";
import ParticlesBg from "particles-bg";
import useAnalyticsEventTracker from "../../useAnalyticsEventTracker";
import { FaPlayCircle, FaBook, FaGithub } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";
import "./headerFP.css";
import logo from "../../../assets/logo.jpeg";
import PopMLvis from "../../../assets/PopMLvis.pdf";
import colors from "../../../config/colors";
import { useNavigate } from "react-router-dom";
import font from "../../../config/font";
import useWindowWidth from "../../../config/useWindowWidth";
import AppNav from "./AppNav";


function Header(props) {
  const gaEventTracker = useAnalyticsEventTracker("social");
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();



  const name = "A better way to analyze population genetics.";
  const bio =
    "Visualize population genetic datasets interactively with PopMLvis, using dimensionality reduction algorithms, machine learning models, and statistical measurements.";

 

  return (
    <div className="main-page" id="home">
     {windowWidth < 500 ? (
        <ParticlesBg type="cobweb" num={40} bg={true} />
      ) : (
        <ParticlesBg type="cobweb" bg={true} />
      )}

      <AppNav></AppNav>

      <div className="row banner">
        <div className="banner-text">
          <h1
            className="responsive-headline"
            style={{
              fontFamily: font.secondaryFont,
              color: colors.primary,
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
              <FaPlayCircle style={{ marginRight: 10 }} /> <div>Start Visualizing</div>
            </a>
            <div className="special-btn-container">
              <a
                onClick={() => navigate("/faq")}
                className="button btn FAQ-btn special-btn"
                style={{ color: "white" }}
              >
                <img style={{ width: "60px", height: "60px" }} src="/faq.png" alt="FAQ Icon"></img>
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
                <FaGithub size={35} />
                <div className="button-txt">Github</div>
              </a>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;