import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import Fade from "react-reveal";
import useAnalyticsEventTracker from './useAnalyticsEventTracker';

function Header(props) {  
    
  //render() {
    const gaEventTracker = useAnalyticsEventTracker('social');
    const name = "PopMLViz";
    const description = "Population Machine Learning Visualization";
    
    
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
                Works
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#contact">
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
              <ul className="social">
                <a href={"https://popmlvis.qcri.org"} className="button btn project-btn" onClick={()=>gaEventTracker('Live')}>
                  <i className="fa fa-book"></i>Live
                </a>
                <a href={"https://github.com/Keivin98/PopMLViz"} className="button btn github-btn" onClick={()=>gaEventTracker('Github')}>
                  <i className="fa fa-github"></i>Github
                </a>
              </ul>
            </Fade>
          
          
          </div>
        </div>
      </header>
    );
  }
//}

export default Header;