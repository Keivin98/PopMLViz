import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import Fade from "react-reveal";
import useAnalyticsEventTracker from './useAnalyticsEventTracker';
import { FaBook , FaGithub } from "react-icons/fa";

function Header(props) {  

    const gaEventTracker = useAnalyticsEventTracker('social');
    const name = "PopMLViz";
    const description = "Population Machine Learning Visualization";
    
    
    return (
      <header id="home">
        <ParticlesBg type="circle" bg={true} />

        <nav id="nav-wrap" style={CSS.NavWrap}>
          <ul id="nav" className="nav" >
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
            <Fade bottom>
              <h1 className="responsive-headline">{name}</h1>
            </Fade>
            <Fade bottom duration={1200}>
              <h3>{description}.</h3>
            </Fade>
            <hr />

            <Fade bottom duration={2000}>
              <ul className="social" style={CSS.Social}>
                <a href={"/Dashboard"} className="button btn project-btn" onClick={()=>gaEventTracker('Live')}>
                  <FaBook /> Live
                </a>
                <a href={"https://github.com/Keivin98/PopMLViz"} className="button btn github-btn" onClick={()=>gaEventTracker('Github')}>
                  <FaGithub/>Github
                </a>
              </ul>
            </Fade>
          
          </div>
        </div>
      </header>
    );
  }


const CSS = {
  NavWrap:{
    font: "15px",
    width: "100%",
    textTransform: "uppercase",
    letterSpacing: "2.5px",
    marginLeft: "39.5%",
    zIndex: "100",
    position: "fixed",
    left: "0",
    top: "0",
    },
  Social:{
    color:"red",
    font: "15px",
    textTransform: "uppercase",
  }
}


export default Header;