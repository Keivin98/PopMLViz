import React, { Component } from "react";
import Fade from "react-reveal";


class Portfolio extends Component {
  render() {
    return (
      <Fade bottom duration={1200}>
      <section id="portfolio">
        <div className="row" style={{width:"30%"}}>
          <h1>Dashboard</h1>
            <img src="./images/portfolio/1.png"/>
        </div>
        <div className="row" style={{width:"30%"}}>
        <h1>2D Plot</h1>
            <img src="./images/portfolio/2.png"/>
        </div>
        <div className="row" style={{width:"30%"}}>
        <h1>Admixture</h1>
          <img src="./images/portfolio/3.png"/>
        </div>
      </section> 
      </Fade>
    );
  }
}

export default Portfolio;
