import React, { useContext, useState } from "react";
import ParticlesBg from "particles-bg";
import useWindowWidth from "../config/useWindowWidth";

export default function ParticleBackground() {
  const { windowWidth, windowHeight } = useWindowWidth();
  let num;
  if (windowHeight < 500) {
    return <ParticlesBg type="cobweb" bg={true} num={20} />;
  }
  if (windowHeight < 600) {
    return <ParticlesBg type="cobweb" bg={true} num={40} />;
  }

  if (windowWidth < 600) {
    num = 20;
  } else if (windowWidth < 800) {
    num = 40;
  } else if (windowWidth < 1200) {
    num = 60;
  } else if (windowWidth < 1600) {
    num = 70;
  } else {
    return <ParticlesBg type="cobweb" bg={true} />;
  }
  return (
    <>
      <ParticlesBg type="cobweb" bg={true} num={num} />
    </>
  );
}
