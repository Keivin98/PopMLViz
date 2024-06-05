import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import Select from "react-select";
import { CirclePicker } from "react-color";

const TabOutputOptions = ({
  uniqueClusters,
  showClusters,
  markerSize: initialMarkerSize,
  dendrogramPath,
  parentCallback,
}) => {
  const [clusterNames, setClusterNames] = useState({});
  const [plotTitle, setPlotTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("png");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [image, setImage] = useState("");
  const [markerSize, setMarkerSize] = useState(4);
  const [chosenInitialColor, setChosenInitialColor] = useState("#f44336");
  const [selectedInitialShape, setSelectedInitialShape] = useState({ value: "circle", label: "circle" });

  const selectActions = [
    { value: "png", label: "png" },
    { value: "svg", label: "svg" },
    { value: "jpeg", label: "jpeg" },
    { value: "webp", label: "webp" },
  ];

  const selectShapeOptions = [
    { value: "circle", label: "circle" },
    { value: "square", label: "square" },
    { value: "diamond", label: "diamond" },
    { value: "x", label: "x" },
    { value: "star", label: "star" },
    { value: "triangle-up", label: "triangle-up" },
    { value: "bowtie", label: "bowtie" },
    { value: "pentagon", label: "pentagon" },
    { value: "hexagon", label: "hexagon" },
    { value: "star-diamond", label: "star-diamond" },
    { value: "circle-cross", label: "circle-cross" },
    { value: "hash", label: "hash" },
    { value: "y-up", label: "y-up" },
    { value: "line-ew", label: "line-ew" },
    { value: "arrow-down", label: "arrow-down" },
  ];

  useEffect(() => {
    setImage(dendrogramPath);
    setMarkerSize(initialMarkerSize !== undefined ? Number(initialMarkerSize) : 4);
  }, [dendrogramPath, initialMarkerSize]);

  const handleFormatChange = (value) => {
    setSelectedColumn(value.label);
  };

  const handleSelectShapeOptions = (value) => {
    setSelectedInitialShape(value);
  };

  const handleIncrementChange = (event) => {
    const newSize = Number(event.target.value);
    if (newSize >= 2 && newSize !== undefined) {
      setMarkerSize(newSize);
    }
  };

  const showOutputOptions = () => {
    let num_clusters = uniqueClusters;
    if (num_clusters < 2) {
      num_clusters = 2;
    }
    return (
      <div style={{ padding: "4%" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h6 style={{ paddingTop: "2%", marginBottom: "10%" }}>Marker size:</h6>
          <div style={{ width: "50%" }}>
            <input
              type="number"
              name="clicks"
              style={{ width: "40%", marginLeft: "10%" }}
              value={markerSize.toString()}
              onChange={handleIncrementChange}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <h6 style={{ paddingTop: "2%", marginBottom: "10%" }}>Marker Color:</h6>
          <div style={{ width: "50%", paddingBottom: "10%", paddingLeft: "2%" }}>
            <CirclePicker
              circleSize={20}
              onChangeComplete={(color) => setChosenInitialColor(color.hex)}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <h6 style={{ paddingTop: "2%", marginBottom: "10%" }}>Marker Shape:</h6>
          <div style={{ width: "50%", paddingBottom: "10%", paddingLeft: "2%" }}>
            <Select
              options={selectShapeOptions}
              onChange={handleSelectShapeOptions}
              defaultValue={selectedInitialShape}
            />
          </div>
        </div>

        <h6>Change plot title:</h6>
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column" }}>
          <div>
            <label style={{ width: "30%" }}>Plot Title</label>
            <input
              type="text"
              style={{ marginLeft: "5%", width: "60%" }}
              onChange={(e) => setPlotTitle(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "2%" }}>
            <label style={{ width: "30%" }}>Width</label>
            <input
              type="text"
              style={{ marginLeft: "5%", width: "20%" }}
              defaultValue={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "2%" }}>
            <label style={{ width: "30%" }}>Height</label>
            <input
              type="text"
              defaultValue={height}
              style={{ marginLeft: "5%", width: "20%" }}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "2%", display: "flex", flexDirection: "row" }}>
            <label style={{ width: "30%" }}>Format</label>
            <div style={{ width: "50%", marginLeft: "5%" }}>
              <Select
                options={selectActions}
                onChange={handleFormatChange}
                defaultValue={selectedColumn}
              />
            </div>
          </div>
        </div>
        {showClusters && (
          <div>
            <h6 style={{ marginTop: "10%" }}>Change cluster names:</h6>
            {[...Array(num_clusters)].map((_, index) => (
              <div style={{ marginTop: "10px" }} key={index}>
                <label style={{ width: "30%" }}>Cluster {index}</label>
                <input
                  type="text"
                  name={index}
                  style={{ marginLeft: "5%", width: "60%" }}
                  onChange={(e) => {
                    const newClusterNames = { ...clusterNames, [index]: e.target.value };
                    setClusterNames(newClusterNames);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {showOutputOptions()}
      <Button
        variant="outlined"
        onClick={(event) => {
          parentCallback({
            clusterNames,
            plotTitle,
            selectedColumn,
            width,
            height,
            image,
            markerSize,
            chosenInitialColor,
            selectedInitialShape,
          });
          event.preventDefault();
        }}
        style={{
          marginLeft: "50%",
          marginTop: "10%",
        }}
      >
        Submit
      </Button>
    </div>
  );
};

TabOutputOptions.propTypes = {
  uniqueClusters: PropTypes.number,
  showClusters: PropTypes.bool,
  markerSize: PropTypes.number,
  dendrogramPath: PropTypes.string,
  parentCallback: PropTypes.func.isRequired,
};

export default TabOutputOptions;
