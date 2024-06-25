import React from "react";
import Select from "react-select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import colors from "../../config/colors";
import font from "../../config/font";

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
  return (
    <div className="radio" style={styles.dimensions}>
      <FormControl style={{ marginLeft: "2%", alignItems: "center", flexDirection: "row" }}>
        <FormLabel
          style={{ marginRight: "30px", fontFamily: font.primaryFont }}
          id="demo-row-radio-buttons-group-label"
        >
          Plot
        </FormLabel>
        <RadioGroup
          style={{ height: "50px", flexWrap: "nowrap" }}
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={selectedOption}
          onChange={onValueChangeDims}
        >
          <FormControlLabel
            value="1D"
            disabled={selectedUploadOption === "admixture"}
            control={<Radio color="success" size="small" />}
            label="1D"
          />
          <FormControlLabel
            value="2D"
            disabled={selectedUploadOption === "admixture"}
            control={<Radio color="success" size="small" />}
            label="2D"
          />
          <FormControlLabel
            value="3D"
            disabled={selectedUploadOption === "admixture"}
            control={<Radio color="success" size="small" />}
            label="3D"
          />
        </RadioGroup>
      </FormControl>
      {/* <div style={{ backgroundColor: colors.gray, width: "1px" }}></div> */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
        <div style={styles.dropDown}>
          <label style={{ width: "25%", marginLeft: "12%" }}>
            <h6 style={styles.axisText}> X-axis </h6>
          </label>
          <div style={{ width: "100%" }}>
            <Select
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

        <div style={styles.dropDown}>
          <label style={{ width: "25%", marginLeft: "12%" }}>
            <h6 style={styles.axisText}> Y-axis </h6>
          </label>
          <div style={{ width: "100%" }}>
            <Select
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
        <div style={styles.dropDown}>
          <label style={{ width: "25%", marginLeft: "12%" }}>
            <h6 style={styles.axisText}> Z-axis </h6>
          </label>
          <div style={{ width: "100%" }}>
            <Select
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
