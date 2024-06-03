import React from "react";
import Navbar from "react-bootstrap/Navbar";

export default function NavigationBar() {
  return (
    <>
      <Navbar
        style={{
          position: "fixed",
          height: "6%",
          width: "100%",
          paddingLeft: "45%",
          backgroundColor: "#3b3f4e",
        }}
      >
        <Navbar.Brand style={{ color: "white", fontSize: 24 }}>
          PopMLVis
          <img src="./logo.jpeg" style={{ width: "6%", position: "fixed", left: "7%", top: "1%" }} alt="" />
        </Navbar.Brand>
      </Navbar>
    </>
  );
}
