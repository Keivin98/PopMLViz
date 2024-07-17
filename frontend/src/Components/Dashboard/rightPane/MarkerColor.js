import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { AiFillCaretDown } from "react-icons/ai";
import { IoIosColorPalette } from "react-icons/io";
import { CirclePicker } from "react-color";
import "../../DropDown.css"


export default function MarkerColor({ setChosenInitialColor, name, clusterColors, index }) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);


  return (
    <div style={{}}>
      <div
        style={{
          marginBottom: "5%",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        onClick={() => setOpen(!open)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "90%",
            alignItems: "center",
          }}
        >
          <IoIosColorPalette size={30} style={{ marginRight: 20, opacity: 0.5 }} />
          <label className="label-txt">{name ? name : "Marker Color"}</label>
        </div>

        <AiFillCaretDown style={{ marginTop: "3%" }} />
      </div>

      <Collapse style={{}} in={open}>
        <div style={{display: "flex", flexDirection: 'column'}}>
          <CirclePicker
            width="100%"
            style={{ marginTop: 20, justifyContent: "center", textAlign: "center"}}
            circleSize={20}
            justifyContent="center"
            // colors={clusterColors}
            onChangeComplete={(color) => {
              // setSelectedColor(color.hex)
              if (clusterColors) {
                const newClusterColors = [...clusterColors]; 
                newClusterColors[index] = color.hex;
                setChosenInitialColor(newClusterColors);
              } else {
                setChosenInitialColor(color.hex);
              }
            }}
            // renderers={(color, i) => (
            //   <div
            //     key={i}
            //     style={{ backgroundColor: color.hex, borderWidth: selectedColor === color.hex ? 2 : 0, borderStyle: "solid"}}
            //   />
            // )}
          />
        </div>
      </Collapse>
    </div>
  );
}
