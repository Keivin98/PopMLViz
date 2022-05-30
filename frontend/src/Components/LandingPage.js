import React, { Component } from "react";
import Header from './Header';
import Portfolio from "./Portfolio";
import Register from "./Register";

class LandingPage extends Component {

  render() {
    return (
      <div>
        
        <Header/>
        <Portfolio/>
        <Register />
        
      </div>
    )
  }
}


export default LandingPage;