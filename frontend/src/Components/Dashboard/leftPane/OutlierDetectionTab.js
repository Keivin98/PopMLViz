import React, { useState, useEffect } from "react";
import Select from "react-select";
import Collapse from "react-bootstrap/Collapse";
import { AiFillCaretDown } from "react-icons/ai";
import { Button, Hidden, IconButton } from "@material-ui/core";
import OutlierBlock from "./OutlierBlock";
import Switch from "./Switch";
import { FcMindMap } from "react-icons/fc";
import { AiFillDelete } from "react-icons/ai";
import PropTypes from "prop-types";
import font from "../../../config/font";
import InputOptions from "../../InputOptions";
import colors from "../../../config/colors";

const OutlierDetectionTab = ({ onChange, numFeatures, removeOutliers, allActions }) => {
  const [selectOutlierActions] = useState([
    {
      label: "None",
      value: 0,
    },
    {
      label: "1 SD",
      value: 1,
    },
    {
      label: "2 SD",
      value: 2,
    },
    {
      label: "3 SD",
      value: 3,
    },
    {
      label: "Isolation Forest",
      value: 4,
    },
    {
      label: "Minimum Covariance Determinant",
      value: 5,
    },
    {
      label: "Local Outlier Factor",
      value: 6,
    },
    {
      label: "OneClassSVM",
      value: 7,
    },
  ]);
  const [selectedOutlierMethod, setSelectedOutlierMethod] = useState({
    label: "None",
    value: 0,
  });
  const [open, setOpen] = useState(false);
  const [columnRange, setColumnRange] = useState([1, numFeatures]);
  const [pressed, setPressed] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [allActionsState, setAllActionsState] = useState(allActions);

  const findName = (allActions) => {
    if (
      allActions.filter((elem) => {
        return Array.isArray(elem) || elem.label.includes("PC");
      }).length > 0
    ) {
      return "PC";
    } else if (
      allActions.filter((elem) => {
        return Array.isArray(elem) || elem.label.includes("TSNE");
      }).length > 0
    ) {
      return "TSNE";
    } else {
      return "Variable";
    }
  };

  useEffect(() => {
    setColumnRange([1, numFeatures]);
    setAllActionsState(allActions);
    setColumnName(findName(allActions));
  }, [numFeatures, allActions]);

  const handleChangeSwitch = (e) => {
    setPressed(e.target.checked);
  };

  const handleOutlierColumnChange = (data) => {
    setColumnRange(data.columnRange);
  };

  const handleOutlierChange = (option) => {
    setSelectedOutlierMethod(option.value);
  };

  const runOutliers = () => {
    onChange({
      selectOutlierActions,
      selectedOutlierMethod,
      open,
      columnRange,
      pressed,
      columnName,
      allActionsState,
    });
  };

  return (
    <div style={{}}>
      <div
        style={{
          marginBottom: "5%",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
        }}
        onClick={() => setOpen(!open)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "80%",
          }}
        >
          <FcMindMap size={30} style={{ marginRight: "3%", opacity: 0.5 }} />
          <label>Outlier Detection </label>
        </div>

        <AiFillCaretDown style={{ marginTop: "3%" }} />
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <InputOptions label={"Algorithm"}>
              <Select
                options={selectOutlierActions}
                defaultValue={selectOutlierActions.find((x) => x.value === selectedOutlierMethod)}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    // width: 100,
                    // height: "100px"
                  }),
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                    // height: "100px"
                  }),
                }}
                onChange={handleOutlierChange}
              />
            </InputOptions>
            <div style={{ display: "flex", color: "white", marginTop: 10, marginBottom: 10 }}>
              {selectedOutlierMethod < 4 && (
                <InputOptions label={"Mode"}>
                  <Switch labelRight={pressed === true ? "OR" : "AND"} onChange={handleChangeSwitch} />
                </InputOptions>
              )}
            </div>
          </div>
          <OutlierBlock
            columnRange={columnRange}
            onChange={handleOutlierColumnChange}
            numFeatures={numFeatures}
            columnName={columnName}
          />

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: 'center', marginTop: 20,}}>
            <Button
              variant="outlined"
              onClick={runOutliers}
              style={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: selectedOutlierMethod == null ? "grey" : colors.blue,
                fontFamily: font.primaryFont,
                marginRight: 5 
              }}
              disabled={selectedOutlierMethod == null}
            >
              Detect Outliers
            </Button>
            <div style={{display: "flex",  justifyContent: 'center', alignItems: 'center', width: 40, height: 40, borderRadius: 100, backgroundColor: "white"}}>
              <IconButton
                variant="outlined"
                aria-label="delete"
                size="medium"
                style={{ color: "red", backgroundColor: "transparent"}}
                onClick={removeOutliers}
              >
                <AiFillDelete />
              </IconButton>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

OutlierDetectionTab.propTypes = {
  numFeatures: PropTypes.number,
  removeOutliers: PropTypes.func,
  allActions: PropTypes.array,
};

export default OutlierDetectionTab;
