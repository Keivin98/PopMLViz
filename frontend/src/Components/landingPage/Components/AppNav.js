import React, { useContext, useState } from "react";
import { BiLogIn } from "react-icons/bi";
import "./headerFP.css";
import logo from "../../../assets/logo.jpeg";
import PopMLvis from "../../../assets/PopMLvis.pdf";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/AuthProvider";
import { FaUser } from "react-icons/fa";
import colors from "../../../config/colors";
import Modal from "@mui/material/Modal";
import { FaRegUserCircle } from "react-icons/fa";
import AppButton from "../../AppButton";
import axios from "axios";

export default function AppNav({}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleFAQClick = () => {
    navigate("/faq");
  };

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}`,
    withCredentials: true,
  });
  const handleLogOut = async () => {
    setModalVisible(false);

    try {
      await api.post("/logout");
      
      console.log("User logged out successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav id="nav-wrap">
      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <div
          style={{
            top: "50%",
            left: "50%",
            position: "absolute",
            width: "50%",
            backgroundColor: "white",
            transform: "translate(-50%, -50%)",
            borderRadius: 30,
            padding: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minWidth: 300,
            paddingTop: 40,
            paddingBottom: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaRegUserCircle size={30} />
            <h5 style={{ marginBottom: 0, marginLeft: 10 }}>{user}</h5>
          </div>
          <AppButton
            color={"red"}
            style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
            title={"logout"}
            onClick={handleLogOut}
          ></AppButton>
        </div>
      </Modal>
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
          <a href="https://github.com/ibrahim-Alasalimy/PopMLViz" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </li>
        <li>
          <a style={{cursor: 'pointer'}} className="smoothscroll" onClick={handleFAQClick}>
            FAQ
          </a>
        </li>
        <li>
          <a style={{cursor: 'pointer'}} className="smoothscroll" onClick={()=> navigate("/tutorial")}>
            Tutorial
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
          <div
            onClick={() => setModalVisible(true)}
            style={{
              width: 50,
              height: 50,
              backgroundColor: colors.secondary,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
            }}
          >
            <FaUser color={"white"} />
          </div>
        )}
      </div>
    </nav>
  );
}
