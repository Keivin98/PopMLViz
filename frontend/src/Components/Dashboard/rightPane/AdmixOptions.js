import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import font from "../../../config/font";

const AdmixOptions = ({ initialAlpha, initialCertainty, initialVal, mode: initialMode, parentCallback, disabled }) => {
  const [alpha, setAlpha] = useState(initialAlpha);
  const [certainty, setCertainty] = useState(initialCertainty);
  const [mode, setMode] = useState(initialMode === 0 ? "Alpha" : "Certainty");

  useEffect(() => {
    setAlpha(initialAlpha);
    setCertainty(initialCertainty);
    setMode(initialMode === 0 ? "Alpha" : "Certainty");
  }, [initialAlpha, initialCertainty, initialMode]);

  const rangeSelectorAlpha = (event, newValue) => {
    setAlpha(newValue);
  };

  const rangeSelectorCertainty = (event, newValue) => {
    setCertainty(newValue);
  };

  const handleApplyClick = (newMode) => (event) => {
    setMode(newMode);
    parentCallback({
      initialAlpha: alpha,
      initialCertainty: certainty,
      mode: newMode,
    });
    event.preventDefault();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // width: "100%",
        justifyContent: "space-between",
        marginTop: "10%",
        marginBottom: "5%",
        // height: "50px",
        paddingTop: "10px",
      }}
    >
      <Typography id="range-slider" gutterBottom>
        <h6 style={{ fontWeight: "bold" }}>Alpha: </h6>
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Slider value={alpha} onChange={rangeSelectorAlpha} valueLabelDisplay="auto" min={1} max={100} />

        <Button
          onClick={handleApplyClick("Alpha")}
          variant="outlined"
          style={{ marginLeft: "10px", fontFamily: font.primaryFont }}
          disabled={disabled}
        >
          Apply
        </Button>
      </div>
      <Typography id="range-slider" gutterBottom>
        <h6 style={{ marginTop: "10%", fontWeight: "bold" }}>Certainty: </h6>
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Slider value={certainty} onChange={rangeSelectorCertainty} valueLabelDisplay="auto" min={1} max={100} />

        <Button
          onClick={handleApplyClick("Certainty")}
          variant="outlined"
          style={{ marginLeft: "10px" }}
          disabled={disabled}
        >
          Apply
        </Button>
      </div>
      <label>
        <span style={{ fontWeight: "bold" }}>{mode}</span> : {mode === "Certainty" ? certainty : alpha} %
      </label>
      <label style={{ marginTop: "10%", fontStyle: "italic" }}>
        NOTE: If the admixture result for the subject is less than the chosen{" "}
        <span style={{ fontWeight: "bold" }}>alpha</span>, the subject will be marked as Admixed! {"\n"}{" "}
      </label>
      <label style={{ marginTop: "10%", fontStyle: "italic" }}>
        {" "}
        If the difference between the top two admixture results for the subject is less than the chosen{" "}
        <span style={{ fontWeight: "bold" }}>certainty</span>, the subject will be marked as Admixed!
      </label>
    </div>
  );
};

AdmixOptions.propTypes = {
  initialAlpha: PropTypes.number.isRequired,
  initialCertainty: PropTypes.number.isRequired,
  initialVal: PropTypes.number,
  mode: PropTypes.number,
  parentCallback: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default AdmixOptions;
