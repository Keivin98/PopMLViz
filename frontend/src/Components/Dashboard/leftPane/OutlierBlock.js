import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { Button } from "@material-ui/core";
import font from "../../../config/font";

const OutlierBlock = ({ columnRange, numFeatures, columnName, onChange }) => {
  const [range, setRange] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (columnRange[1] < columnRange[0]) {
      setRange([columnRange[0], columnRange[0]]);
      setDisabled(true);
    } else {
      setRange([columnRange[0], columnRange[1]]);
      setDisabled(false);
    }
  }, [columnRange]);

  const rangeSelector = (event, newValue) => {
    setRange(newValue);
  };

  const handleApplyClick = () => {
    onChange({ columnRange: range });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "space-between",
        marginBottom: "10%",
        height: "50px",
        paddingTop: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Slider
          value={range}
          onChange={rangeSelector}
          valueLabelDisplay="auto"
          min={1}
          max={numFeatures}
          marks
          style={{ color: "#1891fb" }}
          disabled={disabled}
        />
        <Button
          onClick={handleApplyClick}
          variant="outlined"
          style={{
            fontWeight: "bold",
            marginLeft: "10%",
            backgroundColor: "#ebeff7",
            fontFamily: font.primaryFont,
            color: "#1891fb",
          }}
        >
          Apply
        </Button>
      </div>
      {!disabled && (
        <label>
          {columnName} {range[0]} -- {columnName} {range[1]}
        </label>
      )}
    </div>
  );
};

export default OutlierBlock;
