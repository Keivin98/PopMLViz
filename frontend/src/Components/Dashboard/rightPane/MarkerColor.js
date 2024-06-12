import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { AiFillCaretDown } from "react-icons/ai";
import { IoIosColorPalette } from "react-icons/io";
import { CirclePicker } from "react-color";


export default function MarkerColor({setChosenInitialColor}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ }}>
      <div
        style={{
          marginBottom: "5%",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
          alignItems: 'center',
         
        }}
        onClick={() => setOpen(!open)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "90%",
            alignItems: 'center',
          }}
        >
          <IoIosColorPalette size={30} style={{ marginRight: 20, opacity: 0.5 }} />
          <label>Marker Color</label>
        </div>

        <AiFillCaretDown style={{ marginTop: "3%" }} />
      </div>

      <Collapse style={{}} in={open}>
        <div style={{ }}>
          <CirclePicker c width="100%" style={{marginTop: 20,}} circleSize={20} onChangeComplete={(color) => setChosenInitialColor(color.hex)} />
        </div>
      </Collapse>
    </div>
  );
}
