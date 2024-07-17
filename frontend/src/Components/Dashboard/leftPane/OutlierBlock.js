import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { Button } from "@material-ui/core";
import font from "../../../config/font";
import colors from "../../../config/colors";
import "./leftpane.css";
import AppButton from "../../AppButton";
import { Height } from "@mui/icons-material";

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
      className="outlier-block"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "space-between",
        marginBottom: "10%",
        // height: "50px",
        paddingTop: "10px",
      }}
    >
      <hr></hr>
      <div className="range-slider">
        <Slider
          value={range}
          onChange={rangeSelector}
          valueLabelDisplay="auto"
          min={1}
          max={numFeatures}
          marks
          style={{ color: colors.blue }}
          disabled={disabled}
        />
        <AppButton
          onClick={handleApplyClick}
          variant="outlined"
          title={"Apply"}
          color={"white"}
          textColor={colors.blue}
          className="apply-btn"
          style={{
            marginLeft: "10%",
            // fontFamily: font.primaryFont,
          }}
        ></AppButton>
      </div>
      {!disabled && (
        <label style={{marginTop: 10,}}>
          {columnName} {range[0]} -- {columnName} {range[1]}
        </label>
      )}
      <hr></hr>
    </div>
  );
};

export default OutlierBlock;
