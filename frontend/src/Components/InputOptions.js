import React from "react";

export default function InputOptions({ children, label,  }) {
  return (
    <div
      style={
        {
          marginTop: "10px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }
      }
    >
      <label style={{maxWidth: "50%", marginRight: 10}}>{label}:</label>
      {children}
    </div>
  );
}
