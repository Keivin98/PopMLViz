import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton({ handleBack, color, arrowColor }) {
  return (
    <div
      onClick={handleBack}
      style={{
        display: "flex",
        borderRadius: 50,
        width: 40,
        height: 40,
        backgroundColor: color ? color : "#EEE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 30,
      }}
    >
      <ArrowBackIcon htmlColor={arrowColor ? arrowColor : "black"} style={{ cursor: "pointer" }} />
    </div>
  );
}
