import React from "react";
import colors from "../config/colors";
import { style } from "@mui/system";
import { Button } from "@material-ui/core";
import "./AppButton.css"

export default function AppButton({
  title,
  color,
  textColor,
  onClick,
  style,
  className,
  defaultButton = false,
  ...others
}) {
  return (
    <Button
      {...others}
      onClick={onClick}
      className={`${className} app-button`}
      // sx={{padding: 10}}
      style={{
        ...{
          display: "flex",
          borderRadius: 50,
          width: 100,
          // height: 40,
          backgroundColor: color ? color : colors.secondary,
          justifyContent: "center",
          alignItems: "center",
          color: textColor ? textColor : "white",
          cursor: "pointer",
          padding: 5,
          paddingRight: 10,
          paddingLeft: 10,
        },
        ...style,
      }}
    >
      {title}
    </Button>
  );
}
