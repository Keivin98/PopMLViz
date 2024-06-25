import React from "react";
import Select from "react-select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import colors from "../../config/colors";
import font from "../../config/font";
import "./upperpane.css";
const UpperPane = ({
  selectedOption,
  onValueChangeDims,
  selectedColumns,
  selectActions,
  handleSelectXChange,
  handleSelectYChange,
  handleSelectZChange,
  selectedUploadOption,
  axisRef,
}) => {
  const plotOptions = [
    { value: "1D", label: "1D" },
    { value: "2D", label: "2D" },
    { value: "3D", label: "3D" },
  ];
  return (
    <div className="radio" style={styles.dimensions}>
      <div className="specialDropDown">
        <label style={{  marginLeft: 20}}>
          <h6 className="axisText"> Plot </h6>
        </label>
        <div style={{}}>
          <Select
            // className="select"
            // style={{ width: "120px" }}
            disabled={selectedUploadOption === "admixture"}
            value={{ value: selectedOption ? selectedOption : "1D", label: selectedOption ? selectedOption : "1D", }}
            options={plotOptions}
            onChange={(event) => onValueChangeDims(event, true)}
            // isDisabled={selectedUploadOption === "admixture"} //why disabled?
          />
        </div>
      </div>

      <FormControl className="radioContainer" style={{ marginLeft: "2%", alignItems: "center", flexDirection: "row" }}>
        <FormLabel
          style={{ marginRight: "30px", fontFamily: font.primaryFont }}
          id="demo-row-radio-buttons-group-label"
        >
          Plot
        </FormLabel>
        <RadioGroup
          style={{ height: "50px", flexWrap: "nowrap", fontSize: "12px" }}
          row
          className="radioGroup"
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={selectedOption}
          onChange={onValueChangeDims}
        >
          <FormControlLabel
            className="radioButton"
            value="1D"
            disabled={selectedUploadOption === "admixture"}
            control={<Radio color="success" size="small" />}
            label="1D"
          />
          <FormControlLabel
            className="radioButton"
            value="2D"
            disabled={selectedUploadOption === "admixture"}
            control={<Radio color="success" size="small" />}
            label="2D"
          />
          <FormControlLabel
            className="radioButton"
            value="3D"
            disabled={selectedUploadOption === "admixture"}
            control={<Radio color="success" size="small" />}
            label="3D"
          />
        </RadioGroup>
      </FormControl>
      {/* <div style={{ backgroundColor: colors.gray, width: "1px" }}></div> */}
      <div className="axisContainer">
        <div className="dropDown">
          <label style={{ width: "25%", marginLeft: "12%" }}>
            <h6 className="axisText"> X-axis </h6>
          </label>
          <div className="selectContainer" style={{}}>
            <Select
              className="select"
              ref={axisRef}
              value={{
                value: selectedColumns[0] == null ? "None" : selectedColumns[0],
                label: selectedColumns[0] == null ? "None" : selectedColumns[0],
              }}
              options={selectActions}
              onChange={handleSelectXChange}
              // isDisabled={selectedUploadOption === "admixture"} //why disabled?
            />
          </div>
        </div>

        <div style={{}} className="dropDown">
          <label>
            <h6 className="axisText"> Y-axis </h6>
          </label>
          <div className="selectContainer" style={{}}>
            <Select
              className="select"
              value={{
                value: selectedColumns[1] == null ? "None" : selectedColumns[1],
                label: selectedColumns[1] == null ? "None" : selectedColumns[1],
              }}
              options={selectActions}
              onChange={handleSelectYChange}
              isDisabled={(selectedOption !== "3D" && selectedOption !== "2D") || selectedUploadOption === "admixture"}
            />
          </div>
        </div>
        <div className="dropDown">
          <label style={{ width: "25%", marginLeft: "12%" }}>
            <h6 className="axisText"> Z-axis </h6>
          </label>
          <div className="selectContainer" style={{}}>
            <Select
              className="select"
              value={{
                value: selectedColumns[2] == null ? "None" : selectedColumns[2],
                label: selectedColumns[2] == null ? "None" : selectedColumns[2],
              }}
              options={selectActions}
              onChange={handleSelectZChange}
              isDisabled={selectedOption !== "3D" || selectedUploadOption === "admixture"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dimensions: {
    position: "fixed",
    z_index: 1,
    top: 0,
    marginTop: "10px",
    overflow_x: "hidden",
    left: 0,
    marginLeft: "21%",
    width: "57%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#f5f6f7",
    borderRadius: 10,
    // height: "100px",
  },
  dropDown: {
    // width: "150px",
    // marginLeft: "2%",
    marginLeft: "10px",
    // height: "50px",
  },
  axisText: {
    width: 65,
  },
};

export default UpperPane;
