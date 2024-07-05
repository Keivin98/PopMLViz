import React, { useContext, useState } from "react";
import { BiLogIn } from "react-icons/bi";
import "./headerFP.css";
import logo from "../../../assets/logo.jpeg";
import PopMLvis from "../../../assets/PopMLvis.pdf";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/AuthProvider";
import { FaUser } from "react-icons/fa";
import colors from "../../../config/colors";

export default function AppNav() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleFAQClick = () => {
    navigate("/faq");
  };
  return (
    <nav id="nav-wrap">
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={logo} alt="PopMLVis Logo" className="logo" />
        <span className="site-name">PopMLVis</span>
      </div>
      <ul id="nav" className="nav">
        <li>
          <a href={PopMLvis} target="_blank" rel="noopener noreferrer">
            Docs
          </a>
        </li>
        <li>
          <a href="https://github.com/qcri/QCAI-PopMLVis" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </li>
        <li>
          <a className="smoothscroll" onClick={handleFAQClick}>
            FAQ
          </a>
        </li>
      </ul>
      <div className="nav-right">
        {!user ? (
          <>
            <a href="/login" className="button btn login-btn">
              Login
            </a>
            <button className="button btn login-circle-btn" onClick={handleLoginClick}>
              <BiLogIn size={30} />
            </button>
          </>
        ) : (
          <div style={{width: 50, height: 50, backgroundColor: colors.secondary, display: "flex", justifyContent: 'center', alignItems: 'center', borderRadius: 50}}>
            <FaUser color={"white"}/>
          </div>
        )}
      </div>
    </nav>
  );
}
