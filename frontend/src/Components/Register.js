import React, { useState, setState } from "react";
import { database } from "./firebase";
import { ref, push, child, update } from "firebase/database";
// import { Fade, Slide } from "react-reveal";
import "./registerFP.css";

function Register() {
  const [Name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [institution, setInstitution] = useState(null);
  const [registerText, setRegisterText] = useState("");
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "Name") {
      setName(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "institution") {
      setInstitution(value);
    }
  };

  const handleSubmit = () => {
    let obj = {
      Name: Name,
      email: email,
      institution: institution,
    };
    const newPostKey = push(child(ref(database), "posts")).key;
    const updates = {};
    updates["/" + newPostKey] = obj;
    setRegisterText("Thank you for registering!");
    return update(ref(database), updates);
  };

  return (
    <div className="form">
      <h1 align="center" style={{ fontWeight: "200" }}>
        Register Here
      </h1>
      <div className="form-body" style={{ justifyContent: "center" }}>
        <div className="username">
          <label
            className="form__label"
            style={{ fontWeight: "300" }}
            for="Name"
          >
            Name{" "}
          </label>
          <input
            className="form__input"
            type="text"
            value={Name}
            onChange={(e) => handleInputChange(e)}
            id="Name"
            placeholder="Name"
          />
        </div>
        <div className="email">
          <label
            className="form__label"
            style={{ fontWeight: "300" }}
            for="email"
          >
            Email{" "}
          </label>
          <input
            type="email"
            id="email"
            className="form__input"
            value={email}
            onChange={(e) => handleInputChange(e)}
            placeholder="Email"
          />
        </div>
        <div className="institution">
          <label
            className="form__label"
            style={{ fontWeight: "300" }}
            for="institution"
          >
            Institution
          </label>
          <input
            className="form__input"
            type="text"
            id="institution"
            value={institution}
            onChange={(e) => handleInputChange(e)}
            placeholder="Institution"
          />
        </div>
      </div>

      <div style={{ marginLeft: "40%" }}>
        <button onClick={() => handleSubmit()} type="submit" class="btn">
          Register
        </button>
      </div>
      <label style={{ marginLeft: "30%", marginTop: "5%" }}>
        {registerText}
      </label>
    </div>
  );
}

export default Register;
