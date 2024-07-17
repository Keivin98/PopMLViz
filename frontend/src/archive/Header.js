import React from "react";
import ParticlesBg from "particles-bg";
// import Fade from "react-reveal";
import useAnalyticsEventTracker from "../Components/useAnalyticsEventTracker";
import { FaBook, FaGithub, FaPlayCircle } from "react-icons/fa";
import "./headerFP.css";
import PopMLvis from "../assets/PopMLvis.pdf";
import colors from "../config/colors";

function Header(props) {
  const gaEventTracker = useAnalyticsEventTracker("social");
  const name = "PopMLVis";
  const bio =
    "PopMLvis is a population genetic analysis application. We provide two versions of PopMLvis; a web-based (online) and computer-based (offline) application. It provides a comprehensive interactive environment for scientists, bioinformaticians, and researchers to dig deeper in analyzing population genetic datasets. In order to understand the gene structure, our platform analysis includes dimensionality reduction algorithms, machine learning models, statistical measurements.";
  return (
    <header id="home">
      <ParticlesBg type="circle" bg={true} />

      <nav id="nav-wrap">
        <ul id="nav" className="nav">
          <li className="current">
            <a className="smoothscroll" href="#home">
              Home
            </a>
          </li>

          <li>
            <a className="smoothscroll" href="#portfolio">
              Portfolio
            </a>
          </li>
          <li>
            <a className="smoothscroll" href="#register">
              Register
            </a>
          </li>
        </ul>
      </nav>

      <div className="row banner">
        <div className="banner-text">
          <h1
            className="responsive-headline"
            style={{
              fontFamily: "Arial Black",
              color: colors.primary,
            }}
          >
            {name}
          </h1>
          <div>{bio}</div>
          <hr />

          <ul className="social">
            <a href={"/Dashboard"} className="button btn project-btn" onClick={() => gaEventTracker("Live")}>
              <FaPlayCircle /> Start Now
            </a>
            <a
              href={PopMLvis}
              className="button btn github-btn"
              style={{ color: "white" }}
              onClick={() => gaEventTracker("Docs")}
            >
              <FaBook style={{ marginRight: 10 }} />
              Docs
            </a>
            <a
              className="button btn project-btn"
              style={{ marginLeft: 50 }}
              href={"https://github.com/qcri/QCAI-PopMLVis"}
              onClick={() => gaEventTracker("Github")}
            >
              <FaGithub style={{ marginRight: 10 }} />
              Github
            </a>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
