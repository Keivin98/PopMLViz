import React from "react";
import Select from "react-select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const UpperPane = ({
  selectedOption,
  onValueChangeDims,
  selectedColumns,
  selectActions,
  handleSelectXChange,
  handleSelectYChange,
  handleSelectZChange,
  selectedUploadOption
}) => {
  return (
    <div className="radio" style={styles.dimensions}>
      <FormControl style={{ marginLeft: "2%", marginTop: "1%" }}>
        <FormLabel id="demo-row-radio-buttons-group-label">Plot</FormLabel>
        <RadioGroup
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
      <div style={styles.dropDown}>
        <label style={{ width: "25%", marginLeft: "12%" }}>
          <h6> X-axis </h6>
        </label>
        <div style={{ width: "75%" }}>
          <Select
            value={{
              value: selectedColumns[0] == null ? "None" : selectedColumns[0],
              label: selectedColumns[0] == null ? "None" : selectedColumns[0],
            }}
            options={selectActions}
            onChange={handleSelectXChange}
            isDisabled={selectedUploadOption === "admixture"}
          />
        </div>
      </div>

      <div style={styles.dropDown}>
        <label style={{ width: "25%", marginLeft: "12%" }}>
          <h6> Y-axis </h6>
        </label>
        <div style={{ width: "75%" }}>
          <Select
            value={{
              value: selectedColumns[1] == null ? "None" : selectedColumns[1],
              label: selectedColumns[1] == null ? "None" : selectedColumns[1],
            }}
            options={selectActions}
            onChange={handleSelectYChange}
            isDisabled={
              (selectedOption !== "3D" && selectedOption !== "2D") || selectedUploadOption === "admixture"
            }
          />
        </div>
      </div>
      <div style={styles.dropDown}>
        <label style={{ width: "25%", marginLeft: "12%" }}>
          <h6> Z-axis </h6>
        </label>
        <div style={{ width: "75%" }}>
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
  );
};

const styles = {
  dimensions: {
    position: "fixed",
    z_index: 1,
    top: "8%",
    overflow_x: "hidden",
    left: 0,
    marginLeft: "21%",
    width: "57%",
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    backgroundColor: "#f5f6f7",
    borderRadius: 10,
  },
  dropDown: {
    width: "21%",
    marginLeft: "2%",
  },
};

export default UpperPane;
