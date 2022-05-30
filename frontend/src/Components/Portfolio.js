import React, { Component } from "react";
import Fade from "react-reveal";


class Portfolio extends Component {
  render() {
    return (
      <Fade bottom duration={1200}>
      <section id="portfolio" style={CSS.portfolio}>
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


const CSS = {
  portfolio:  {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: "5%",
 
  }
}


export default Portfolio;
