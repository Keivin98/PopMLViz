import React, { useContext, useState } from "react";
import ParticlesBg from "particles-bg";
import useWindowWidth from "../config/useWindowWidth";

export default function ParticleBackground() {
  const windowWidth = useWindowWidth();

  return (
    <>
      {windowWidth < 600 ? <ParticlesBg type="cobweb" num={40} bg={true} /> : <ParticlesBg type="cobweb" bg={true} />}
    </>
  );
}
