import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as Plotly from "plotly.js";

const randomColors = [
  "#3f91ba",
  "#801f65",
  "#86af43",
  "#d73521",
  "#1d4c91",
  "#2c663b",
  "#cc9d3f",
  "#ff7ae6",
  "#d87368",
  "#99f7a2",
  "#a3a6ed",
  "#0740ba",
  "#277f05",
];

const BarPlot = (props) => {
  const [numClusters, setNumClusters] = useState(2);
  const [dataNew, setDataNew] = useState([]);
  const [positionOfUndefined, setPositionOfUndefined] = useState(0);

  const range = (start, end) => {
    var len = end - start + 1;
    var a = new Array(len);
    for (let i = 0; i < len; i++) a[i] = start + i;
    return a;
  };

  const assignClusterToRow1 = (row) => {
    var parsedRow = Object.values(row).map((a) => parseFloat(a));
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    if (rowDescending[0] < props.alphaVal / 100) {
      return parsedRow.length;
    } else {
      return parsedRow.indexOf(rowDescending[0]);
    }
  };

  const assignClusterToRow2 = (row) => {
    var parsedRow = Object.values(row).map((a) => parseFloat(a));
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    if (rowDescending[0] - rowDescending[1] < props.certaintyVal / 100.0) {
      return parsedRow.length;
    } else {
      return parsedRow.indexOf(rowDescending[0]);
    }
  };

  useEffect(() => {
    createBarPlot();
  }, [props.data, props.clusterNames, props.picWidth, props.picHeight, props.picFormat, props.plotTitle, props.alphaVal, props.certaintyVal, props.admixMode]);

  const createBarPlot = () => {
    var colors = [];
    var data_new = [];

    if (props.data.length > 0 && props.data != null) {
      const numClusters = Object.keys(props.data[0]).length;

      for (let j = 0; j < numClusters; j += 1) {
        colors.push(randomColors[j]);
      }
      let sortedValues = [];
      let positionOfUndefined = -1;
      if (props.admixMode === 0) {
        sortedValues = [...props.data].sort((a, b) => assignClusterToRow1(a) > assignClusterToRow1(b) ? 1 : -1);
        positionOfUndefined = sortedValues.map((x) => assignClusterToRow1(x)).indexOf(numClusters);
      } else {
        sortedValues = [...props.data].sort((a, b) => assignClusterToRow2(a) > assignClusterToRow2(b) ? 1 : -1);
        positionOfUndefined = sortedValues.map((x) => assignClusterToRow2(x)).indexOf(numClusters);
      }

      for (let n = 1; n < numClusters + 1; n += 1) {
        var name = !(n - 1 in props.clusterNames)
          ? n - 1 === numClusters
            ? "Undefined Cluster"
            : "Cluster " + (n - 1)
          : props.clusterNames[n - 1];
        let y_values = sortedValues.map((x) => x["v" + n]);
        if (positionOfUndefined <= 0) {
          data_new.push({
            type: "bar",
            name: name,
            x: [
              ...range(0, positionOfUndefined),
              ...range(
                positionOfUndefined + 5,
                Math.max(y_values.length, positionOfUndefined + 4)
              ),
            ],
            y: y_values,
            marker: {
              opacity: range(0, y_values.length).map((x) =>
                x < positionOfUndefined ? 1 : positionOfUndefined < 0 ? 1 : 0.2
              ),
              color: colors[n - 1],
            },
          });
        } else {
          data_new.push({
            type: "bar",
            name: name,
            x: [
              ...range(0, positionOfUndefined),
              ...range(
                positionOfUndefined + 5,
                Math.max(y_values.length, positionOfUndefined + 4)
              ),
            ],
            y: y_values,
            marker: {
              opacity: range(0, y_values.length).map((x) =>
                x < positionOfUndefined ? 1 : 0.2
              ),
              color: colors[n - 1],
            },
          });
        }
      }
      if (positionOfUndefined > 0) {
        data_new.push({
          type: "bar",
          name: "Admixed",
          x: range(positionOfUndefined, positionOfUndefined + 5),
          y: [1.1, 1.1, 1.1, 1.1, 1.1],
          base: [-0.05, -0.05, -0.05, -0.05, -0.05],
          marker: {
            color: "black",
          },
        });
      }

      if (numClusters !== numClusters) {
        setNumClusters(numClusters);
        if (props.onChange) {
          props.onChange({
            numClusters: numClusters,
            data_new: data_new,
          });
        }
      }

      setDataNew(data_new);
      setPositionOfUndefined(positionOfUndefined);
      Plotly.newPlot(
        "barPlot",
        data_new,
        {
          title: props.plotTitle,
          barmode: "stack",
          bargap: 0,
          autosize: false,
          height: props.picHeight, // Use props.picHeight for the plot height
          width: props.picWidth, // Use props.picWidth for the plot width
          margin: { l: 0, r: 0, t: 0, b: 0, pad: 0 }, // Adjust margins here
        },
        {
          toImageButtonOptions: {
            filename: props.plotTitle,
            width: props.picWidth,
            height: props.picHeight,
            format: props.picFormat,
          },
        }
      );
    }
  };

  return <div id="barPlot" style={{ width: `${props.picWidth}px`, height: `${props.picHeight}px` }}></div>;
};

BarPlot.propTypes = {
  data: PropTypes.array,
  alphaVal: PropTypes.number,
  certaintyVal: PropTypes.number,
  clusterNames: PropTypes.array,
  AdmixOptionsLabelCheck: PropTypes.bool,
  plotTitle: PropTypes.string,
  picWidth: PropTypes.number,
  picHeight: PropTypes.number,
  picFormat: PropTypes.string,
};

export default BarPlot;
