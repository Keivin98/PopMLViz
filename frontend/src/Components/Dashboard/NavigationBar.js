import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import colors from "../../config/colors";

export default function NavigationBar() {
  const navigate = useNavigate();

  function handleHomeClick() {
    navigate("/");
  }
  return (
    <>
      <Navbar
        style={{
          position: "fixed",
          height: "50px",
          width: "100%",
          paddingLeft: "45%",
          backgroundColor: colors.primary,
        }}
      >
        <Navbar.Brand onClick={handleHomeClick} style={{ cursor: "pointer", color: "white", fontSize: 24 }}>
          PopMLVis
          <img src="./logo.jpeg" style={{ width: "6%", position: "fixed", left: "7%", top: "1%" }} alt="" />
        </Navbar.Brand>
      </Navbar>
    </>
  );
}
