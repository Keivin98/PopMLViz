import React, { Component } from "react";
import Fade from "react-reveal";


class Portfolio extends Component {
  render() {
    return (
      <Fade bottom duration={1200}>
      <section id="portfolio" style={CSS.portfolio}>
        <div className="row" style={{width:"30%"}}>
          <h1 style={CSS.portfolio}>Dashboard</h1>
            <img src="./images/portfolio/1.png"/>
        </div>
        <div className="row" style={{width:"30%"}}>
          <h1 style={CSS.portfolio}>2D Plot</h1>
            <img src="./images/portfolio/2.png"/>
        </div>
        <div className="row" style={{width:"30%"}}>
          <h1 style={CSS.portfolio}>Admixture</h1>
            <img src="./images/portfolio/3.png"/>
        </div>
      </section> 
      </Fade>
    );
  }
}


const CSS = {
  portfolio:  {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: "5%",
    fontSize: "2rem",
  }
}


export default Portfolio;
