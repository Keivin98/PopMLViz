import React from "react";
import "./InputOptions.css";

export default function InputOptions({ children, label }) {
  return (
    <div className="inputOption">
      <div className="inputLabel">{label}:</div>
      <div className="inputField">{children}</div>
    </div>
  );
}
