import React, { useState, setState } from "react";
import { database } from "./firebase";
import { ref, push, child, update } from "firebase/database";
// import { Fade, Slide } from "react-reveal";
import "./registerFP.css";
import Email from "./Email";
import ContactUS from "./ContactUS";

function Register() {
  return (
    <section id="register" className="rowC">
      <ContactUS />
      <Email />
    </section>
  );
}

export default Register;
