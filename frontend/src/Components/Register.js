import React, { useState, setState } from "react";
import { database } from "./firebase";
import { ref, push, child, update } from "firebase/database";
// import { Fade, Slide } from "react-reveal";
import "./registerFP.css";

function Register() {
  const [Name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [institution, setInstitution] = useState(null);

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
    console.log(Name, email, institution);
    let obj = {
      Name: Name,
      email: email,
      institution: institution,
    };
    const newPostKey = push(child(ref(database), "posts")).key;
    const updates = {};
    updates["/" + newPostKey] = obj;
    return update(ref(database), updates);
  };

  return (
    <div className="form">
      {/* <Fade bottom duration={1000}> */}
      <h1 align="center">Register Here.</h1>
      {/* </Fade> */}
      {/* <Slide left duration={1000}> */}
      <div className="form-body">
        <div className="username">
          <label className="form__label" for="Name">
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
          <label className="form__label" for="email">
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
          <label className="form__label" for="institution">
            Institution
          </label>
          <input
            className="form__input"
            type="text"
            id="institution"
            value={institution}
            onChange={(e) => handleInputChange(e)}
            placeholder="institution"
          />
        </div>
      </div>

      {/* <div className="msg">
        <label className="form__label" for="msg">
          Message
        </label>
        <textarea className="form-control" rows="5" id="message" />
        <input className="form__input" type="text" id="institution" placeholder="Message" />
      </div> */}

      <div style={{ marginLeft: "30%" }}>
        <button onClick={() => handleSubmit()} type="submit" class="btn">
          Register
        </button>
        <button onClick={() => handleSubmit()} type="submit" class="btn">
          Send Mail
        </button>
      </div>
      {/* </Slide> */}
    </div>
  );
}

export default Register;
