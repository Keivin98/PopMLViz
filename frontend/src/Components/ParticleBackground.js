import React, { useContext, useState } from "react";
import ParticlesBg from "particles-bg";
import useWindowWidth from "../config/useWindowWidth";

export default function ParticleBackground() {
  const windowWidth = useWindowWidth();
  const config = {
    num: 40, // Number of particles
    rps: 0.01, // Speed of particles, default is 0.1, adjust as needed
    type: "cobweb", // Type of particles
    bg: true // Enable background mode
  };

  return (
    <>
      {windowWidth < 600 ? <ParticlesBg type="cobweb" bg={true} num={40} config={config} /> : <ParticlesBg type="cobweb" bg={true} config={config} />}
    </>
  );
}
