import React from "react";
import colors from "../config/colors";
import { style } from "@mui/system";

export default function AppButton({ title, color, textColor, onClick, style }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...{
          display: "flex",
          borderRadius: 50,
          width: 100,
          height: 40,
          backgroundColor: color ? color : colors.secondary,
          justifyContent: "center",
          alignItems: "center",
          color: textColor ? textColor : "white",
          cursor: "pointer",
        },
        ...style,
      }}
    >
      {title}
    </div>
  );
}
