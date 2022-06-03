import React, { Component } from "react";
import ParticlesBg from "particles-bg";
// import Fade from "react-reveal";
import useAnalyticsEventTracker from "./useAnalyticsEventTracker";
import { FaBook, FaGithub, FaPlayCircle } from "react-icons/fa";
import "./headerFP.css";
import PopMLvis from "../assets/PopMLvis.pdf";
function Header(props) {
  const gaEventTracker = useAnalyticsEventTracker("social");
  const name = "PopMLViz";
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
          <h1 className="responsive-headline">{name}</h1>
          <h2 style={{ fontWeight: "200", fontSize: 24 }}>{bio}.</h2>
          <hr />

          <ul className="social">
            <a
              href={"/Dashboard"}
              className="button btn project-btn"
              onClick={() => gaEventTracker("Live")}
            >
              <FaPlayCircle /> Live
            </a>
            <a
              href={"https://github.com/qcri/QCAI-PopMLVis"}
              className="button btn github-btn"
              onClick={() => gaEventTracker("Github")}
            >
              <FaGithub />
              Github
            </a>
            <a
              href={PopMLvis}
              className="button btn project-btn"
              style={{ marginLeft: 50 }}
              onClick={() => gaEventTracker("Github")}
            >
              <FaBook />
              Docs
            </a>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
