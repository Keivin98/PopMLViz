import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import * as XLSX from "xlsx";
import ScatterPlot from "./centralPane/ScatterPlot";
import ScatterAdmix from "./ScatterAdmix";
import ProgressBarTime from "./ProgressBarTime";
import "react-tabs/style/react-tabs.css";
import NavigationBar from "./NavigationBar";
import LeftPane from "./leftPane/LeftPane";
import RightPane from "./rightPane/RightPane";
import UpperPane from "./UpperPane";
import CentralPane from "./centralPane/CentralPane";
import colors from "../../config/colors";
import * as Plotly from "plotly.js";
import BarPlot from "./centralPane/BarPlot";
import "./dashboard.css";

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

const randomShapes = [
  "circle",
  "square",
  "diamond",
  "x",
  "star",
  "triangle-up",
  "bowtie",
  "pentagon",
  "hexagon",
  "star-diamond",
  "circle-cross",
  // "hash",
  // "y-up",
  // "line-ew",
  "arrow-down",
];

Chart.register(...registerables);

const App = () => {
  const [numClusters, setNumClusters] = useState(2);
  const [ProgressBarType, setProgressBarType] = useState("Loader");
  const [ProgressBarTimeInterval, setProgressBarTimeInterval] = useState(5);
  const [columnRange, setColumnRange] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [columns, setColumns] = useState(null);
  const [data, setData] = useState(null);
  const [coloredData, setColoredData] = useState([]);
  const [shapedData, setShapedData] = useState([]);
  const [pressed, setPressed] = useState(false);
  const [clusterNames, setClusterNames] = useState({});
  const [alphaVal, setAlphaVal] = useState(40);
  const [certaintyVal, setCertaintyVal] = useState(40);
  const [allActions, setAllActions] = useState([]);
  const [selectActions, setSelectActions] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([null, null, null]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedUploadOption, setSelectedUploadOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clusterColors, setClusterColors] = useState({});
  const [show, setShow] = useState(true);
  const [multiValue, setMultiValue] = useState([]);
  const [describingValues, setDescribingValues] = useState([]);
  const [selectedDescribingColumn, setSelectedDescribingColumn] = useState();
  const [selectedDescribingColumnColor, setSelectedDescribingColumnColor] = useState({ value: "None", label: "None" });
  const [selectedDescribingColumnShape, setSelectedDescribingColumnShape] = useState({ value: "None", label: "None" });
  const [sampleDatasets, setSampleDatasets] = useState([
    { value: 0, label: "1000 Genomes Project (1KG)" },
    { value: 1, label: "Human Genome Diversity Project (HGDP)" },
  ]);
  const [sampleDatasetValue, setSampleDatasetValue] = useState(0);
  const [selectedClusterMethod, setSelectedClusterMethod] = useState(null);
  const [OutlierData, setOutlierData] = useState([]);
  const [showOutputOptions, setShowOutputOptions] = useState(false);
  const [selectedColorShape, setSelectedColorShape] = useState(0);
  const [admix, setAdmix] = useState([]);
  const [admixOptionsLabelCheck, setAdmixOptionsLabelCheck] = useState(true);
  const [plotTitle, setPlotTitle] = useState("");
  const [mappingIDColumn, setMappingIDColumn] = useState("");
  const [picHeight, setPicHeight] = useState(600);
  const [picWidth, setPicWidth] = useState(800);
  const [picFormat, setPicFormat] = useState("png");
  const [metaData, setMetaData] = useState([]);
  const [metaDataColumns, setMetaDataColumns] = useState([]);
  const [dendrogramPath, setDendrogramPath] = useState("");
  const [markerSize, setMarkerSize] = useState(4);
  const [admixMode, setAdmixMode] = useState(0);
  const [chosenInitialColor, setChosenInitialColor] = useState("#f44336");
  const [chosenInitialShape, setChosenInitialShape] = useState("diamond");
  const [shouldDownload, setShouldDownload] = useState(false);
  const [chosenClusterColors, setChosenClusterColors] = useState([]);
  const [fileChanged, setFileChanged] = useState();
  const axisRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  //
  useEffect(() => {
    if (shouldDownload) {
      Plotly.downloadImage(ScatterPlot, data, {
        filename: plotTitle,
        width: picWidth,
        height: picHeight,
        format: picFormat,
      });
      setShouldDownload(false);
    }
  }, [shouldDownload, plotTitle, picWidth, picHeight, picFormat]);

  useEffect(() => {
    if (fileChanged) {
      axisRef.current.focus();
      setTimeout(() => setFileChanged(false), 0); //to prevent infinite loop
    }
  }, [fileChanged]);

  const handleClose = () => setModalOpen(false);

  console.log(process.env.REACT_APP_PROTOCOL);
  const handleMultiChange = (option) => {
    let act = [];
    for (var i = 0; i < columns.length; i++) {
      act.push({
        value: columns[i]["name"].toLowerCase(),
        label: columns[i]["name"],
      });
    }
    setMultiValue([{ value: "None", label: "None" }, ...option]);
    setSelectActions(
      act.filter((elem) => {
        return option.indexOf(elem) < 0;
      })
    );
  };

  const setColumnsState = (columns) => {
    let act = [];
    for (var i = 0; i < columns.length; i++) {
      act.push({
        value: columns[i]["name"].toLowerCase(),
        label: columns[i]["name"],
      });
    }
    setColumns(columns);
    setSelectActions(act);
    setAllActions(act);
  };

  const updateData = (data) => {
    setData(data);
  };

  const updateAdmix = (data) => {
    setAdmix(data);
  };

  const updateMetaData = (data) => {
    setMetaData(data);
  };

  const setMetaDataColumnsFunction = (columns) => {
    let act = [];
    for (var i = 0; i < columns.length; i++) {
      act.push({
        value: columns[i]["name"].toLowerCase(),
        label: columns[i]["name"],
      });
    }
    setMetaDataColumns(columns);
    setSelectActions([...selectActions, act]);
    setAllActions([...allActions, act]);
  };

  const updateOutlierData = (data) => {
    setOutlierData(
      data.map((elem) => {
        return parseInt(elem[0], 10);
      })
    );
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const scatter1d = (y) => {
    var x1 = [];
    var y1 = [];
    var cluster_texts = [];
    var mapping_id = mappingIDColumn !== "";

    var hoverTemplate =
      mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}) </i>"
        : "<i>(%{x}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
    if (data != null && y != null) {
      for (var i = 0; i < data.length; i++) {
        x1.push(i);
        y1.push(data[i][y]);

        if (mapping_id) {
          cluster_texts.push(data[i][mappingIDColumn]);
        }
      }
      var data_new = [
        {
          name: "Data",
          x: x1,
          y: y1,
          mode: "markers",
          text: cluster_texts,
          hovertemplate: hoverTemplate,
          marker: {
            color: chosenInitialColor,
            size: markerSize,
            symbol: chosenInitialShape,
          },
        },
      ];
    }
    return (
      <ScatterPlot
        data={data_new}
        layout={{
          title: plotTitle,
          yaxis: { title: y },
        }}
        picWidth={Number(picWidth)}
        picHeight={Number(picHeight)}
        picFormat={picFormat}
        plotTitle={plotTitle}
      />
    );
  };

  const scatterCategorical = (DIM, x, y, z, categoricalData, colorOrShape) => {
    if (selectedColorShape === 2) {
      return scatterCategorical2(DIM, x, y, z);
    }
    var uniqueTags = [];
    var layout = {};
    var data_new = [];
    var mapping_id = mappingIDColumn !== "";

    var hoverTemplate2D =
      mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}) </i>"
        : "<i>(%{x}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";

    var hoverTemplate3D =
      mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}, %{z:.4f}) </i>"
        : "<i>(%{x}, %{y:.4f}), %{z:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
    let tooManyUniqueValues = false;
    if (categoricalData != null) {
      // find unique values
      let uniqueTags = new Set();

      for (let catID = 0; catID < categoricalData.length; catID++) {
        uniqueTags.add(categoricalData[catID]);

        if (uniqueTags.size > 20) {
          tooManyUniqueValues = true; // Set the flag

          alert("There are too many unique values! Check the categorical data!");
          // Handle the state update if needed
          setColoredData([]);
          setSelectedDescribingColumnColor({ value: "None", label: "None" });
          setSelectedDescribingColumnShape({ value: "None", label: "None" });

          break; // Break out of the loop;
        }
      }
      if (!tooManyUniqueValues) {
        uniqueTags = [...Array.from(uniqueTags)];

        for (var colID = 0; colID < uniqueTags.length; colID++) {
          data_new.push({});

          if (DIM === 2) {
            if (selectedColorShape === 0) {
              data_new[colID] = {
                name: uniqueTags[colID],
                x: [],
                y: [],
                z: [],
                type: "scatter3d",
                mode: "markers",
                marker: {
                  color: randomColors[colID],
                  symbol: chosenInitialShape,
                  size: markerSize,
                },
                text: [],
                hovertemplate: hoverTemplate3D,
              };
            } else {
              data_new[colID] = {
                name: uniqueTags[colID],
                x: [],
                y: [],
                z: [],
                type: "scatter3d",
                mode: "markers",
                marker: {
                  color: chosenInitialColor,
                  symbol: randomShapes[colID],
                  size: markerSize,
                },
                text: [],
                hovertemplate: hoverTemplate3D,
              };
            }
          } else {
            if (selectedColorShape === 0) {
              data_new[colID] = {
                name: uniqueTags[colID],
                x: [],
                y: [],
                mode: "markers",
                marker: {
                  color: randomColors[colID],
                  symbol: chosenInitialShape,
                  size: markerSize,
                },
                text: [],
                hovertemplate: hoverTemplate2D,
              };
            } else {
              data_new[colID] = {
                name: uniqueTags[colID],
                x: [],
                y: [],
                mode: "markers",
                marker: {
                  color: chosenInitialColor,
                  symbol: randomShapes[colID],
                  size: markerSize,
                },
                text: [],
                hovertemplate: hoverTemplate2D,
              };
            }
          }
        }

        if (data != null) {
          for (var i = 0; i < data.length; i++) {
            var categoryID = uniqueTags.indexOf(categoricalData[i]);
            if (DIM === 0) {
              data_new[categoryID].x.push(i);
              data_new[categoryID].y.push(data[i][x]);
            } else if (DIM === 1) {
              data_new[categoryID].x.push(data[i][x]);
              data_new[categoryID].y.push(data[i][y]);
            } else {
              data_new[categoryID].x.push(data[i][x]);
              data_new[categoryID].y.push(data[i][y]);
              data_new[categoryID].z.push(data[i][z]);
            }
            if (mapping_id) {
              data_new[categoryID].text.push(data[i][mappingIDColumn]);
            }
          }
        }
        var plot_title = plotTitle;

        if (DIM === 0) {
          layout = {
            title: plot_title,
            xaxis: { title: "ID" },
            yaxis: { title: y },
          };
        } else if (DIM === 1) {
          layout = {
            title: plot_title,
            xaxis: { title: x },
            yaxis: { title: y },
          };
        } else {
          layout = {
            legend: {
              yanchor: "top",
              y: 0.89,
              xanchor: "right",
              x: 0.99,
            },
            margin: {
              l: 0,
              r: 0,
              b: 0,
              t: 0,
            },
            scene: {
              aspectratio: {
                x: 1,
                y: 1,
                z: 1,
              },
              camera: {
                center: {
                  x: 0,
                  y: 0,
                  z: 0,
                },
                eye: {
                  x: 1.25,
                  y: 1.25,
                  z: 1.25,
                },
                up: {
                  x: 0,
                  y: 0,
                  z: 1,
                },
              },
              xaxis: {
                type: "linear",
                zeroline: false,
                title: x,
              },
              yaxis: {
                type: "linear",
                zeroline: false,
                title: y,
              },
              zaxis: {
                type: "linear",
                zeroline: false,
                title: z,
              },
            },
            title: plot_title,
          };
        }

        return (
          <ScatterPlot
            data={data_new}
            layout={layout}
            picWidth={picWidth}
            picHeight={picHeight}
            picFormat={picFormat}
            plotTitle={plotTitle}
          />
        );
      }
    }
  };

  const scatterCategorical2 = (DIM, x, y, z) => {
    var uniqueTags1 = [];
    var uniqueTags2 = [];
    var layout = {};
    var data_new = [];
    var mapping_id = mappingIDColumn !== "";
    var hoverTemplate2D =
      mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}) </i>"
        : "<i>(%{x}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
    var hoverTemplate3D =
      mappingIDColumn === ""
        ? "<i>(%{x}, %{y:.4f}, %{z:.4f}) </i>"
        : "<i>(%{x}, %{y:.4f}), %{z:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";

    // find unique values
    for (var catID = 0; catID < coloredData.length; catID++) {
      if (uniqueTags1.indexOf(coloredData[catID]) === -1) {
        uniqueTags1.push(coloredData[catID]);
      }
    }
    for (catID = 0; catID < shapedData.length; catID++) {
      if (uniqueTags2.indexOf(shapedData[catID]) === -1) {
        uniqueTags2.push(shapedData[catID]);
      }
    }
    if (uniqueTags1.length > 20 || uniqueTags2.length > 20) {
      alert("There are too many unique values! Check the categorical data!");
      setColoredData([]);
      setSelectedDescribingColumn(null);
      return;
    }

    for (var colID1 = 0; colID1 < uniqueTags1.length; colID1++) {
      for (var colID2 = 0; colID2 < uniqueTags2.length; colID2++) {
        data_new.push({});
        var colID = colID1 * uniqueTags2.length + colID2;
        if (DIM === 2) {
          data_new[colID] = {
            name: uniqueTags1[colID1] + " " + uniqueTags2[colID2],
            x: [],
            y: [],
            z: [],
            type: "scatter3d",
            mode: "markers",
            marker: {
              color: randomColors[colID1],
              symbol: randomShapes[colID2],
              size: markerSize,
            },
            text: [],
            hovertemplate: hoverTemplate3D,
          };
        } else {
          data_new[colID] = {
            name: uniqueTags1[colID1] + " " + uniqueTags2[colID2],
            x: [],
            y: [],
            mode: "markers",
            marker: {
              color: randomColors[colID1],
              symbol: randomShapes[colID2],
              size: markerSize,
            },
            text: [],
            hovertemplate: hoverTemplate2D,
          };
        }
      }
    }
    if (data != null) {
      for (var i = 0; i < data.length; i++) {
        var categoryID1 = uniqueTags1.indexOf(coloredData[i]);
        var categoryID2 = uniqueTags2.indexOf(shapedData[i]);

        var categoryID = categoryID1 * uniqueTags2.length + categoryID2;
        console.log(categoryID1, categoryID2, uniqueTags2, shapedData[i], categoryID, data_new.length);
        if (DIM === 0) {
          data_new[categoryID].x.push(i);
          data_new[categoryID].y.push(data[i][x]);
        } else if (DIM === 1) {
          data_new[categoryID].x.push(data[i][x]);
          data_new[categoryID].y.push(data[i][y]);
        } else {
          data_new[categoryID].x.push(data[i][x]);
          data_new[categoryID].y.push(data[i][y]);
          data_new[categoryID].z.push(data[i][z]);
        }
        if (mapping_id) {
          data_new[categoryID].text.push(data[i][mappingIDColumn]);
        }
      }
    }
    var plot_title = plotTitle;

    if (DIM === 0) {
      layout = {
        title: plot_title,
        xaxis: { title: "ID" },
        yaxis: { title: y },
      };
    } else if (DIM === 1) {
      layout = {
        title: plot_title,
        xaxis: { title: x },
        yaxis: { title: y },
      };
    } else {
      layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
        scene: {
          aspectratio: {
            x: 1,
            y: 1,
            z: 1,
          },
          camera: {
            center: {
              x: 0,
              y: 0,
              z: 0,
            },
            eye: {
              x: 1.25,
              y: 1.25,
              z: 1.25,
            },
            up: {
              x: 0,
              y: 0,
              z: 1,
            },
          },
          xaxis: {
            type: "linear",
            zeroline: false,
            title: x,
          },
          yaxis: {
            type: "linear",
            zeroline: false,
            title: y,
          },
          zaxis: {
            type: "linear",
            zeroline: false,
            title: z,
          },
        },
        title: plot_title,
      };
    }

    return (
      <ScatterPlot
        data={data_new}
        layout={layout}
        picWidth={picWidth}
        picHeight={picHeight}
        picFormat={picFormat}
        plotTitle={plotTitle}
      />
    );
  };

  const scatterWithClusters = (DIM, x, y, z, outliers, coloredData) => {
    var x_clusters = [];
    var y_clusters = [];
    var layout = {};
    var hoverTemplate = "";
    var mapping_id = false;
    if (DIM === 2) {
      var z_clusters = [];
      mapping_id = mappingIDColumn !== "";
      hoverTemplate =
        mappingIDColumn === ""
          ? "<i>(%{x:.4f}, %{y:.4f} %{z:.4f}) </i>"
          : "<i>(%{x:.4f}, %{y:.4f} %{z:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
    } else {
      mapping_id = mappingIDColumn !== "";
      hoverTemplate =
        mappingIDColumn === ""
          ? "<i>(%{x:.4f}, %{y:.4f}) </i>"
          : "<i>(%{x:.4f}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
    }
    var cluster_texts = [];

    if (outliers) {
      var x_clusters_outliers = [];
      var y_clusters_outliers = [];
      if (DIM === 2) {
        var z_clusters_outliers = [];
      }
    }
    for (var num_cl = 0; num_cl < numClusters; num_cl++) {
      x_clusters.push([]);
      y_clusters.push([]);
      if (DIM === 2) {
        z_clusters.push([]);
      }
      if (outliers) {
        x_clusters_outliers.push([]);
        y_clusters_outliers.push([]);
        if (DIM === 2) {
          z_clusters_outliers.push([]);
        }
      }
      cluster_texts.push([]);
    }

    var colors = [];

    for (let j = 0; j < numClusters; j += 1) {
      if (chosenClusterColors && chosenClusterColors[j]) {
        colors.push(chosenClusterColors[j]);
      } else {
        colors.push(randomColors[j]);
      }
    }

    if (data != null) {
      for (var i = 0; i < data.length; i++) {
        let rowCol = clusterColors[i];

        if (!x_clusters[rowCol]) x_clusters[rowCol] = [];
        if (!y_clusters[rowCol]) y_clusters[rowCol] = [];
        if (DIM === 2 && !z_clusters[rowCol]) z_clusters[rowCol] = [];

        if (outliers) {
          if (!x_clusters_outliers[rowCol]) x_clusters_outliers[rowCol] = [];
          if (!y_clusters_outliers[rowCol]) y_clusters_outliers[rowCol] = [];
          if (DIM === 2 && !z_clusters_outliers[rowCol]) z_clusters_outliers[rowCol] = [];
        }

        if (outliers && coloredData[i]) {
          if (DIM === 0) {
            x_clusters_outliers[rowCol].push(i);
            y_clusters_outliers[rowCol].push(data[i][x]);
          } else if (DIM === 1) {
            x_clusters_outliers[rowCol].push(data[i][x]);
            y_clusters_outliers[rowCol].push(data[i][y]);
          } else {
            x_clusters_outliers[rowCol].push(data[i][x]);
            y_clusters_outliers[rowCol].push(data[i][y]);
            z_clusters_outliers[rowCol].push(data[i][z]);
          }
        } else {
          if (DIM === 0) {
            x_clusters[rowCol].push(i);
            y_clusters[rowCol].push(data[i][x]);
          } else if (DIM === 1) {
            x_clusters[rowCol].push(data[i][x]);
            y_clusters[rowCol].push(data[i][y]);
          } else {
            x_clusters[rowCol].push(data[i][x]);
            y_clusters[rowCol].push(data[i][y]);
            z_clusters[rowCol].push(data[i][z]);
          }
        }
        if (mapping_id) {
          cluster_texts[rowCol].push(data[i][mappingIDColumn]);
        }
      }
      var data_new = [];
      for (var k = 0; k < numClusters; k += 1) {
        if (outliers) {
          if (DIM === 2) {
            data_new.push({
              name: "Outliers " + clusterNames[k],
              x: x_clusters_outliers[k],
              y: y_clusters_outliers[k],
              z: z_clusters_outliers[k],
              mode: "markers",
              type: "scatter3d",
              marker: {
                color: colors[k],
                size: markerSize,
                symbol: "cross",
                opacity: 0.5,
              },
              text: cluster_texts[k],
              hovertemplate: hoverTemplate,
            });
          } else {
            data_new.push({
              name: "Outliers " + clusterNames[k],
              x: x_clusters_outliers[k],
              y: y_clusters_outliers[k],
              mode: "markers",
              marker: {
                color: colors[k],
                symbol: "cross",
                opacity: 0.5,
                size: markerSize,
              },
              text: cluster_texts[k],
              hovertemplate: hoverTemplate,
            });
          }
        }
        var name = clusterNames && clusterNames[k] ? clusterNames[k] : "Cluster " + k;
        if (DIM === 2) {
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            z: z_clusters[k],
            mode: "markers",
            type: "scatter3d",
            marker: { color: colors[k], size: markerSize },
            text: cluster_texts[k],
            hovertemplate: hoverTemplate,
          });
        } else {
          data_new.push({
            name: name,
            x: x_clusters[k],
            y: y_clusters[k],
            mode: "markers",
            marker: { color: colors[k], size: markerSize },
            text: cluster_texts[k],
            hovertemplate: hoverTemplate,
          });
        }
      }
    }
    var plot_title = plotTitle;

    if (DIM === 2) {
      layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
        scene: {
          aspectratio: {
            x: 1,
            y: 1,
            z: 1,
          },
          camera: {
            center: {
              x: 0,
              y: 0,
              z: 0,
            },
            eye: {
              x: 1.25,
              y: 1.25,
              z: 1.25,
            },
            up: {
              x: 0,
              y: 0,
              z: 1,
            },
          },
          xaxis: {
            type: "linear",
            zeroline: false,
            title: x,
          },
          yaxis: {
            type: "linear",
            zeroline: false,
            title: y,
          },
          zaxis: {
            type: "linear",
            zeroline: false,
            title: z,
          },
        },
        title: plot_title,
      };
    } else {
      layout = {
        title: plot_title,
        xaxis: { title: x },
        yaxis: { title: y },
      };
    }
    return (
      <ScatterPlot
        data={data_new}
        layout={layout}
        picWidth={picWidth}
        picHeight={picHeight}
        picFormat={picFormat}
        plotTitle={plotTitle}
      />
    );
  };

  const scatterCategoricalandOutliers = (DIM, x, y, z, categoricalData, coloredData, outliersOnly) => {
    var cluster_texts = [];
    var uniqueTags = [];
    var layout = {};
    var mapping_id = mappingIDColumn !== "";
    var hoverTemplate = "";
    if (categoricalData != null) {
      // find unique values
      for (var catID = 0; catID < categoricalData.length; catID++) {
        if (uniqueTags.indexOf(categoricalData[catID]) === -1) {
          uniqueTags.push(categoricalData[catID]);
        }
      }
      var data_new = [];
      for (var colID = 0; colID < uniqueTags.length; colID++) {
        var outlierColor = outliersOnly ? "grey" : randomColors[colID];
        var otherColor = outliersOnly ? chosenInitialColor : randomColors[colID];
        var title = outliersOnly ? "0" : uniqueTags[colID];

        if (DIM === 2) {
          hoverTemplate = !mapping_id
            ? "<i>(%{x:.4f}, %{y:.4f} %{z}, %{z:.4f}) </i>"
            : "<i>(%{x:.4f}, %{y:.4f} %{z}, %{z:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
          // actual data
          data_new.push({
            name: title,
            x: [],
            y: [],
            z: [],
            type: "scatter3d",
            mode: "markers",
            marker: { color: otherColor, size: markerSize },
            text: [],
            hovertemplate: hoverTemplate,
          });
          // outliers
          data_new.push({
            name: "Outliers " + title,
            x: [],
            y: [],
            z: [],
            type: "scatter3d",
            mode: "markers",
            marker: {
              color: outlierColor,
              size: markerSize,
              symbol: "cross",
              opacity: "0.5",
            },
            text: [],
            hovertemplate: hoverTemplate,
          });
        } else {
          hoverTemplate = !mapping_id
            ? "<i>(%{x:.4f}, %{y:.4f}</i>"
            : "<i>(%{x:.4f}, %{y:.4f}</i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
          data_new.push({
            name: title,
            x: [],
            y: [],
            mode: "markers",
            marker: { color: otherColor, size: markerSize },
            text: [],
            hovertemplate: hoverTemplate,
          });
          data_new.push({
            name: "Outliers " + title,
            x: [],
            y: [],
            mode: "markers",
            marker: {
              color: outlierColor,
              symbol: "cross",
              opacity: "0.5",
              size: markerSize,
            },
            text: [],
            hovertemplate: hoverTemplate,
          });
        }
        cluster_texts.push([]);
        cluster_texts.push([]);
      }
    }

    if (data != null) {
      for (var i = 0; i < data.length; i++) {
        var categoryID = uniqueTags.indexOf(categoricalData[i]);
        if (DIM === 0) {
          if (coloredData[i]) {
            data_new[2 * categoryID + 1].x.push(i);
            data_new[2 * categoryID + 1].y.push(data[i][x]);
            if (mapping_id) {
              data_new[2 * categoryID + 1].text.push(data[i][mappingIDColumn]);
            }
          } else {
            data_new[2 * categoryID].x.push(i);
            data_new[2 * categoryID].y.push(data[i][x]);
            if (mapping_id) {
              data_new[2 * categoryID].text.push(data[i][mappingIDColumn]);
            }
          }
        } else if (DIM === 1) {
          if (coloredData[i]) {
            data_new[2 * categoryID + 1].x.push(data[i][x]);
            data_new[2 * categoryID + 1].y.push(data[i][y]);
            if (mapping_id) {
              data_new[2 * categoryID + 1].text.push(data[i][mappingIDColumn]);
            }
          } else {
            data_new[2 * categoryID].x.push(data[i][x]);
            data_new[2 * categoryID].y.push(data[i][y]);
            if (mapping_id) {
              data_new[2 * categoryID].text.push(data[i][mappingIDColumn]);
            }
          }
        } else {
          if (coloredData[i]) {
            data_new[2 * categoryID + 1].x.push(data[i][x]);
            data_new[2 * categoryID + 1].y.push(data[i][y]);
            data_new[2 * categoryID + 1].z.push(data[i][z]);
            if (mapping_id) {
              data_new[2 * categoryID + 1].text.push(data[i][mappingIDColumn]);
            }
          } else {
            data_new[2 * categoryID].x.push(data[i][x]);
            data_new[2 * categoryID].y.push(data[i][y]);
            data_new[2 * categoryID].z.push(data[i][z]);
            if (mapping_id) {
              data_new[2 * categoryID].text.push(data[i][mappingIDColumn]);
            }
          }
        }
      }
    }

    var plot_title = plotTitle;

    if (DIM === 0) {
      layout = {
        title: plot_title,
        yaxis: { title: y },
      };
    } else if (DIM === 1) {
      layout = {
        title: plot_title,
        xaxis: { title: x },
        yaxis: { title: y },
      };
    } else {
      layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
        scene: {
          aspectratio: {
            x: 1,
            y: 1,
            z: 1,
          },
          camera: {
            center: {
              x: 0,
              y: 0,
              z: 0,
            },
            eye: {
              x: 1.25,
              y: 1.25,
              z: 1.25,
            },
            up: {
              x: 0,
              y: 0,
              z: 1,
            },
          },
          xaxis: {
            type: "linear",
            zeroline: false,
            title: x,
          },
          yaxis: {
            type: "linear",
            zeroline: false,
            title: y,
          },
          zaxis: {
            type: "linear",
            zeroline: false,
            title: z,
          },
        },
        title: plot_title,
      };
    }

    return (
      <ScatterPlot
        data={data_new}
        layout={layout}
        picWidth={picWidth}
        picHeight={picHeight}
        picFormat={picFormat}
        plotTitle={plotTitle}
      />
    );
  };
  const scatter2d = (x, y) => {
    var x1 = [];
    var y1 = [];
    var cluster_texts = [];
    var mapping_id = mappingIDColumn !== "";

    var hoverTemplate = !mapping_id
      ? "<i>(%{x}, %{y:.4f}) </i>"
      : "<i>(%{x}, %{y:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";

    if (data != null && x != null && y != null) {
      for (var i = 0; i < data.length; i++) {
        x1.push(data[i][x]);
        y1.push(data[i][y]);
        if (mapping_id) {
          cluster_texts.push(data[i][mappingIDColumn]);
        }
      }
      var data_new = [
        {
          name: "Data",
          x: x1,
          y: y1,
          mode: "markers",
          text: cluster_texts,
          hovertemplate: hoverTemplate,
          marker: {
            color: chosenInitialColor,
            size: markerSize,
            symbol: chosenInitialShape,
          },
        },
      ];
    }
    return (
      <ScatterPlot
        data={data_new}
        layout={{
          title: plotTitle,
          xaxis: { title: x },
          yaxis: { title: y },
        }}
        picWidth={picWidth}
        picHeight={picHeight}
        picFormat={picFormat}
        plotTitle={plotTitle}
      />
    );
  };

  const scatter3d = (x, y, z) => {
    var x1 = [];
    var z1 = [];
    var y1 = [];
    var cluster_texts = [];

    var mapping_id = mappingIDColumn !== "";
    var hoverTemplate = !mapping_id
      ? "<i>(%{x:.4f}, %{y:.4f} %{z}, %{z:.4f}) </i>"
      : "<i>(%{x:.4f}, %{y:.4f} %{z}, %{z:.4f}) </i>" + "<br><b>Mapping ID</b>:%{text}</b></br>";
    if (data != null && x != null && y != null && z != null) {
      for (var i = 0; i < data.length; i++) {
        x1.push(data[i][x]);
        y1.push(data[i][y]);
        z1.push(data[i][z]);
        if (mapping_id) {
          cluster_texts.push(data[i][mappingIDColumn]);
        }
      }
      var data_new = [
        {
          name: "Data",
          x: x1,
          y: y1,
          z: z1,
          mode: "markers",
          type: "scatter3d",
          text: cluster_texts,
          hovertemplate: hoverTemplate,
          marker: {
            color: chosenInitialColor,
            size: markerSize,
            symbol: chosenInitialShape,
          },
        },
      ];
      var layout = {
        legend: {
          yanchor: "top",
          y: 0.89,
          xanchor: "right",
          x: 0.99,
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
        scene: {
          aspectratio: {
            x: 1,
            y: 1,
            z: 1,
          },
          camera: {
            center: {
              x: 0,
              y: 0,
              z: 0,
            },
            eye: {
              x: 1.25,
              y: 1.25,
              z: 1.25,
            },
            up: {
              x: 0,
              y: 0,
              z: 1,
            },
          },
          xaxis: {
            type: "linear",
            zeroline: false,
            title: x,
          },
          yaxis: {
            type: "linear",
            zeroline: false,
            title: y,
          },
          zaxis: {
            type: "linear",
            zeroline: false,
            title: z,
          },
        },
        title: plotTitle,
      };
    }
    return (
      <ScatterPlot
        data={data_new}
        layout={layout}
        picWidth={picWidth}
        picHeight={picHeight}
        picFormat={picFormat}
        plotTitle={plotTitle}
      />
    );
  };

  const processData = async (dataString, outliers, type) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    var selectedUploadOption = selectedUploadOption;
    var headers = [];
    if (selectedUploadOption === "typeture" || type === 2) {
      headers = [...Array(dataStringLines[0].split(" ").length)].map((x, index) => {
        return "v" + (index + 1);
      });
    } else {
      var headersCommaDelim = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      var headersSpaceDelim = dataStringLines[0].split(" ");
      if (headersCommaDelim.length > headersSpaceDelim.length) {
        headers = headersCommaDelim;
      } else {
        headers = headersSpaceDelim;
      }
    }
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      var row = [];
      if (selectedUploadOption === "typeture" || type === 2) {
        row = dataStringLines[i - 1].split(" ");
      } else {
        var rowCommaDelim = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        var rowSpaceDelim = dataStringLines[i].split(" ");
        if (rowCommaDelim.length > rowSpaceDelim.length) {
          row = rowCommaDelim;
        } else {
          row = rowSpaceDelim;
        }
      }
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));
    if (outliers === true) {
      updateOutlierData(list);
    } else {
      if (type != null) {
        if (type === 1) {
          setData(list);
          setColumnsState(columns);
        }
        if (type === 2) {
          setAdmix(list);
        }
        if (type === 3) {
          setMetaData(list);
          setMetaDataColumnsFunction(columns);
        }
      } else {
        setData(list);
        setColumnsState(columns);
      }
    }
  };
  const mergeDataWithMetaData = () => {
    if (!("IID" in data[0])) {
      alert("Dataset does not include IID.");
      return;
    } else if (!("IID" in metaData[0])) {
      alert("MetaData does not include IID.");
      return;
    } else if (data.length !== metaData.length) {
      alert("The dimensions do not match! Only the available metadata will be matched.");
    }

    var mergedData = data.map((elem, index) => {
      var ID = elem["IID"];
      var result = metaData.filter((elem) => {
        return elem["IID"] === ID;
      });
      if (result.length > 0) {
        var { IID, ...extraData } = result[0];
        return Object.assign({}, elem, extraData);
      } else {
        var columns = Object.keys(metaData[0]);
        var no_match = {};
        for (var i = 0; i < columns.length; i++) {
          if (columns[i] !== "IID") {
            no_match[columns[i]] = "No match";
          }
        }
        return Object.assign({}, elem, no_match);
      }
    });

    const uniqueIds = [];
    const mergedColumns = [...columns, ...metaDataColumns];
    const mergedColumnsFiltered = mergedColumns.filter((element) => {
      const isDuplicate = uniqueIds.includes(element.name);
      if (!isDuplicate) {
        uniqueIds.push(element.name);
        return true;
      }
      return false;
    });

    setColumnsState(mergedColumnsFiltered);
    setData(mergedData);
    setMetaData([]);
  };

  const handleFileUpload = (e, type) => {
    if (selectedUploadOption === "Correlation Matrix") {
      UploadCMDataset(e);
    } else {
      setSelectedFile(e.target.files[0]);
      setIsLoading(false);
      setOutlierData([]);
      setColoredData([]);
      setClusterNames([]);
      setClusterColors([]);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        processData(data, false, type).then(() => {
          if (type === 3) {
            return mergeDataWithMetaData();
          }
          if (selectedUploadOption === "PCA") {
          } else if (selectedUploadOption === "t-SNE 2D") {
            runTSNE2d();
          } else if (selectedUploadOption === "t-SNE 3D") {
            runTSNE3d();
          }
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleFileUploadNew = (file, type) => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    if (selectedUploadOption === "Correlation Matrix") {
      UploadCMDatasetNew(file, type);
    } else {
      setSelectedFile(file);
      setIsLoading(false);
      setOutlierData([]);
      setColoredData([]);
      setClusterNames([]);
      setClusterColors([]);
      const reader = new FileReader();
      reader.onload = (evt) => {
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        processData(data, false, type).then(() => {
          if (type === 3) {
            return mergeDataWithMetaData();
          }
          if (selectedUploadOption === "PCA") {
          } else if (selectedUploadOption === "t-SNE 2D") {
            runTSNE2d();
          } else if (selectedUploadOption === "t-SNE 3D") {
            runTSNE3d();
          }
        });
      };
      handleClose();
      reader.readAsBinaryString(file);
    }
  };
  //processed upload
  const handleProcessedPCA = (file) => {
    setSelectedUploadOption("PCA");
    handleFileUploadNew(file);
  };

  const handleProcessedAdmix = (files) => {
    setSelectedUploadOption("pcairandadmixture");
    handleFileUploadNew(files[0], 1);
    handleFileUploadNew(files[1], 2);
  };

  //unprocessed upload
  const handleUnprocessedPCA = (file, name) => {
    setSelectedUploadOption("Correlation Matrix");
    handleFileUploadNew(file, name);
  };

  const handleTSNE2D = (file) => {
    setSelectedUploadOption("t-SNE 2D");
    handleFileUploadNew(file);
  };

  const handleTSNE3D = (file) => {
    setSelectedUploadOption("t-SNE 3D");
    handleFileUploadNew(file);
  };

  const handleAdmixFileUpload1 = (e) => {
    handleFileUpload(e, 1);
  };

  const handleAdmixFileUpload2 = (e) => {
    handleFileUpload(e, 2);
  };

  const handleMetaDataUpload = (e) => {
    handleFileUpload(e, 3);
  };

  const handleSampleDataset = (option) => {
    setSampleDatasetValue(option.value);
  };

  const handleSelectXChange = (value) => {
    setSelectedColumns([value.label, selectedColumns[1], selectedColumns[2]]);
  };

  const handleSelectYChange = (value) => {
    setSelectedColumns([selectedColumns[0], value.label, selectedColumns[2]]);
  };

  const handleSelectZChange = (value) => {
    setSelectedColumns([selectedColumns[0], selectedColumns[1], value.label]);
  };

  const onUploadValueChange = (event) => {
    setSelectedUploadOption(event.target.value);
  };

  const onValueChangeDims = (event, isDropDown) => {
    let value;
    if (isDropDown) {
      value = event.value;
    } else {
      value = event.target.value;
    }
    var newSelected = [];
    if (value === "1D") {
      newSelected = [selectedColumns[0], null, null];
      setSelectedOption(value);
      setSelectedColumns(newSelected);
    } else if (value === "2D") {
      newSelected = selectedColumns;
      newSelected[2] = null;
      setSelectedOption(value);
      setSelectedColumns(newSelected);
    } else {
      setSelectedOption(value);
    }
  };

  const onValueChangeColorShape = (event) => {
    setSelectedColorShape(event.target.value);
    showScatterPlot();
  };

  const formSubmit = (event) => {
    event.preventDefault();
  };

  const UploadCMDataset = (e) => {
    setIsLoading(true);
    setProgressBarType("ProgressBar");
    setProgressBarTimeInterval(150);

    // Create an object of formData
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("filename", e.target.value);
    setIsLoading(true);

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/uploadCM/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        setSelectedUploadOption("PCA");
        processData(response.data, false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
  };

  const UploadCMDatasetNew = (file, name) => {
    setIsLoading(true);
    setProgressBarType("ProgressBar");
    setProgressBarTimeInterval(150);

    // Create an object of formData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", name);
    setIsLoading(true);

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/uploadCM/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        setSelectedUploadOption("PCA");
        processData(response.data, false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
  };

  const runCluster = (s) => {
    if (s.selectedClusterMethod === 0) {
      runKmeans(s.num_clusters);
    } else if (s.selectedClusterMethod === 1) {
      runHC(s.num_clusters);
    } else {
      runFuzzy(s.num_clusters);
    }
  };

  const runOutliers = (s) => {
    if (!data) {
      setIsLoading(false);
      alert("Please make sure to upload a dataset first");
      return;
    }
    const inputFormat = selectedUploadOption.includes("t-SNE") ? "tsne" : "pca";
    detectOutliers(s.selectedOutlierMethod, s.columnRange, s.pressed, inputFormat);
  };

  const removeOutliers = () => {
    setOutlierData([]);
  };

  const runKmeans = (num_clusters) => {
    const formData = {
      df: data,
      num_clusters: num_clusters,
    };

    if (!data) {
      setIsLoading(false);
      alert("Please make sure to upload a dataset first");
      return;
    }

    setIsLoading(true);
    setProgressBarType("Loader");
    setAdmix([]);
    setSelectedUploadOption("PCA");

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/runkmeans/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((r) => {
        var cluster_names = {};
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = "Cluster " + index;
        });
        setIsLoading(false);
        setClusterColors(r.data);
        setClusterNames(cluster_names);
        setShowOutputOptions(true);
        setColoredData([]);
        setSelectedDescribingColumn({ value: "None", label: "None" });
        setNumClusters(num_clusters);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
  };

  const runHC = (num_clusters) => {
    const formData = {
      df: data,
      num_clusters: num_clusters,
    };

    if (!data) {
      setIsLoading(false);
      alert("Please make sure to upload a dataset first");
      return;
    }

    setIsLoading(true);
    setProgressBarType("Loader");

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/runhc/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((r) => {
        var cluster_names = {};
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = "Cluster " + index;
        });
        setIsLoading(false);
        setClusterColors(r.data.result);
        setDendrogramPath(r.data.filename);
        setClusterNames(cluster_names);
        setShowOutputOptions(true);
        setColoredData([]);
        setSelectedDescribingColumn({ value: "None", label: "None" });
        setNumClusters(num_clusters);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Network error! Please check the request or try again.");
      });
  };

  const runFuzzy = (num_clusters) => {
    const formData = {
      df: data,
      num_clusters: num_clusters,
      admix: [],
      selectedUploadOption: "PCA",
    };

    if (!data) {
      setIsLoading(false);
      alert("Please make sure to upload a dataset first");
      return;
    }

    setIsLoading(true);
    setProgressBarType("Loader");

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/runfuzzy/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        var cluster_names = {};
        [...Array(num_clusters)].map((x, index) => {
          cluster_names[index] = "Cluster " + index;
        });
        setIsLoading(false);
        setClusterColors(r.data);
        setClusterNames(cluster_names);
        setShowOutputOptions(true);
        setColoredData([]);
        setSelectedDescribingColumn({ value: "None", label: "None" });
        setNumClusters(num_clusters);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
  };

  const runTSNE2d = () => {
    const formData = {
      df: data,
    };
    setIsLoading(true);
    setProgressBarType("ProgressBar");
    setProgressBarTimeInterval(70);

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/cmtsne2d/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        setIsLoading(false);
        setColoredData([]);
        setSelectedDescribingColumn({ value: "None", label: "None" });
        setOutlierData([]);
        setClusterNames({});
        setClusterColors([]);
        processData(r.data, false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
  };

  const runTSNE3d = () => {
    const formData = {
      df: data,
    };
    setIsLoading(true);
    setProgressBarType("ProgressBar");
    setProgressBarTimeInterval(70);

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/cmtsne3d/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        setIsLoading(false);
        setColoredData([]);
        setSelectedDescribingColumn({ value: "None", label: "None" });
        setOutlierData([]);
        setClusterNames({});
        setClusterColors([]);
        processData(r.data, false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
  };

  const runPCAir = (bedName, bimName, famName, kinshipName) => {
    setIsLoading(true);
    setProgressBarType("ProgressBar");
    setProgressBarTimeInterval(80);

    console.log({
      bedName: bedName,
      bimName: bimName,
      famName: famName,
      kinshipName: kinshipName,
    });

    const formData = {
      bedName: bedName,
      bimName: bimName,
      famName: famName,
      kinshipName: kinshipName,
    };

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/runPCAIR`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        setIsLoading(false);
        processData(r.data, false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
  };

  const samplePCADataset = () => {
    setIsLoading(true);
    setProgressBarType("Loader");
    setOutlierData([]);
    setClusterNames({});
    setClusterColors([]);
    setColoredData([]);
    setDendrogramPath("");

    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/samplePCA/${sampleDatasetValue}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        setIsLoading(false);
        setColoredData([]);
        setSelectedDescribingColumn({ value: "None", label: "None" });
        processData(r.data, false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
  };

  const samplePCAAdmixDataset = () => {
    setIsLoading(true);
    setProgressBarType("Loader");
    setOutlierData([]);
    setClusterNames({});
    setClusterColors([]);
    setDendrogramPath("");

    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/samplePCAAdmixDataset/${sampleDatasetValue}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        setIsLoading(false);
        setColoredData([]);
        setSelectedDescribingColumn({ value: "None", label: "None" });
        processData(r.data.pca, false, 1);
        processData(r.data.admix, false, 2);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
  };

  const samplePCAAdmixDataset2 = (dstype, sampleDatasetValue) => {
    setIsLoading(true);
    setProgressBarType("Loader");
    setOutlierData([]);
    setClusterNames({});
    setClusterColors([]);
    setDendrogramPath("");
    setSelectedUploadOption(dstype == 0 ? "PCA" : "pcairandadmixture");
    setFileChanged(true);

    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/samplePCAAdmixDataset/${sampleDatasetValue}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        setIsLoading(false);
        setColoredData([]);
        setSelectedDescribingColumn({ value: "None", label: "None" });
        processData(r.data.pca, false, 1);
        processData(r.data.admix, false, 2);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
      });
    console.log("samplePCAAdmixDataset2");
  };

  const detectOutliers = (selectedOutlierMethod, columnRange, pressed, inputFormat) => {
    if (selectedOutlierMethod === 0) {
      updateOutlierData([]);
    } else {
      const formData = {
        df: data,
        method: selectedOutlierMethod,
        columnRange: columnRange,
        combineType: pressed,
        inputFormat: inputFormat,
      };
      setIsLoading(true);
      setProgressBarType("Loader");

      axios
        .post(
          `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/detectoutliers/`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((r) => {
          setIsLoading(false);
          setSelectedUploadOption(selectedUploadOption.includes("t-SNE") ? "PCA" : selectedUploadOption);
          setSelectedColorShape(0); // keep it always to zero, because we do not need the shaped data
          processData(r.data, true);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
          alert("Server error! Please check the input and try again. If the error persists, refer to the docs! ");
        });
    }
  };

  const handleColoredColumns = (event) => {
    setColoredData(event.label === "None" ? [] : data.map((elem) => elem[event.label]));
    setSelectedDescribingColumnColor(event);
    setSelectedDescribingColumnShape(
      selectedDescribingColumnShape.value === event.value
        ? { value: "None", label: "None" }
        : selectedDescribingColumnShape
    );
    setShowOutputOptions(false);
    setSelectedColorShape(
      selectedDescribingColumnShape.value === event.value || selectedDescribingColumnShape.value === "None"
        ? 0 //only color
        : 2 //both shape and color
    );
    setClusterNames([]);
    setClusterColors([]);
    showScatterPlot();
  };

  const handleShapeColumns = (event) => {
    setShapedData(event.label === "None" ? [] : data.map((elem) => elem[event.label]));
    setColoredData(selectedDescribingColumnColor === event ? [] : coloredData);
    setSelectedDescribingColumnShape(event);
    setSelectedDescribingColumnColor(
      selectedDescribingColumnColor.value === event.value
        ? { value: "None", label: "None" }
        : selectedDescribingColumnColor
    );
    setShowOutputOptions(false);
    setSelectedColorShape(
      selectedDescribingColumnColor.value === event.value || selectedDescribingColumnColor.value === "None"
        ? 1 //only shape
        : 2 //both shape and color
    );
    setClusterNames([]);
    setClusterColors([]);
    setOutlierData([]);
    showScatterPlot();
  };

  const showScatterPlot = () => {
    const x = selectedColumns[0];
    const y = selectedColumns[1];
    const z = selectedColumns[2];
    var categoricalData = [];
    if (selectedColorShape === 0) {
      categoricalData = coloredData;
    } else {
      categoricalData = shapedData;
    }
    const outlierData = OutlierData;
    const ONE_DIM = 0;
    const TWO_DIM = 1;
    const THREE_DIM = 2;

    if (selectedUploadOption === "pcairandadmixture" && data != null && admix.length > 0) {
      return (
        <ScatterAdmix
          PCAdata={data}
          AdmixData={admix}
          alphaVal={alphaVal}
          certaintyVal={certaintyVal}
          outlierData={outlierData}
          x={selectedColumns[0]}
          y={selectedColumns[1]}
          z={selectedColumns[2]}
          clusterNames={clusterNames}
          onChange={clusterNumberChange}
          plotTitle={plotTitle}
          picWidth={Number(picWidth)}
          picHeight={Number(picHeight)}
          picFormat={picFormat}
          markerSize={markerSize}
          admixMode={admixMode}
        />
      );
    } else {
      if (selectedColumns[0] === null && selectedColumns[1] === null && selectedColumns[2] === null) {
        return (
          <ScatterPlot
            data={[]}
            picWidth={picWidth}
            picHeight={picHeight}
            picFormat={picFormat}
            plotTitle={plotTitle}
          />
        );
      } else if (selectedColumns[1] === null && selectedColumns[2] === null) {
        if (clusterColors.length > 0 || categoricalData.length > 0 || outlierData.length > 0) {
          if (outlierData.length > 0) {
            if (clusterColors.length > 0) {
              return scatterWithClusters(ONE_DIM, x, null, null, true, outlierData);
            } else if (categoricalData.length > 0) {
              return scatterCategoricalandOutliers(ONE_DIM, x, null, null, categoricalData, outlierData, false);
            } else {
              return scatterCategoricalandOutliers(ONE_DIM, x, null, null, outlierData, outlierData, true);
            }
          } else if (categoricalData.length > 0) {
            return scatterCategorical(ONE_DIM, x, null, null, categoricalData, false);
          } else {
            return scatterWithClusters(ONE_DIM, x, null, null, false);
          }
        } else {
          return scatter1d(x);
        }
      } else if (selectedColumns[2] === null) {
        if (clusterColors.length > 0 || categoricalData.length > 0 || outlierData.length > 0) {
          if (outlierData.length > 0) {
            if (clusterColors.length > 0) {
              return scatterWithClusters(TWO_DIM, x, y, null, true, outlierData);
            } else if (categoricalData.length > 0) {
              return scatterCategoricalandOutliers(TWO_DIM, x, y, null, categoricalData, outlierData, false);
            } else {
              return scatterCategoricalandOutliers(TWO_DIM, x, y, null, outlierData, outlierData, true);
            }
          } else if (categoricalData.length > 0) {
            return scatterCategorical(TWO_DIM, x, y, z, categoricalData);
          } else {
            return scatterWithClusters(TWO_DIM, x, y, null, false, null, null);
          }
        } else {
          return scatter2d(x, y);
        }
      } else {
        if (clusterColors.length > 0 || categoricalData.length > 0 || outlierData.length > 0) {
          if (outlierData.length > 0) {
            if (clusterColors.length > 0) {
              return scatterWithClusters(THREE_DIM, x, y, z, true, outlierData);
            } else if (categoricalData.length > 0) {
              return scatterCategoricalandOutliers(THREE_DIM, x, y, z, categoricalData, outlierData, false);
            } else {
              return scatterCategoricalandOutliers(THREE_DIM, x, y, z, outlierData, outlierData, true);
            }
          } else if (categoricalData.length > 0) {
            return scatterCategorical(THREE_DIM, x, y, z, categoricalData);
          } else {
            return scatterWithClusters(THREE_DIM, x, y, z, false, null, null);
          }
        } else {
          return scatter3d(x, y, z);
        }
      }
    }
  };

  const onInputMetadataClick = (event) => {
    event.target.value = "";
    event.target.label = "";
  };

  const DRTabChange = (data) => {
    setSelectedUploadOption(data.selectedUploadOption);
    setIsLoading(data.isLoading);
    setProgressBarType(data.ProgressBarType);
    setProgressBarTimeInterval(data.ProgressBarTimeInterval);
  };

  const clusterNumberChange = (data) => {
    setNumClusters(data.numClusters);
  };

  const UploadTabChange = (data) => {
    if (data.selectedUploadOption === "pcairandadmixture") {
      setSelectedUploadOption(data.selectedUploadOption);
      setShowOutputOptions(true);
    } else {
      setSelectedUploadOption(data.selectedUploadOption);
    }
  };

  const handleTabOutputCallback = (outputState) => {
    setClusterNames(outputState.clusterNames);
    setChosenClusterColors(outputState.chosenClusterColors);
    setPlotTitle(outputState.plotTitle);
    setPicWidth(outputState.width);
    setPicHeight(outputState.height);
    setPicFormat(outputState.selectedColumn);
    setChosenInitialColor(outputState.chosenInitialColor);
    setChosenInitialShape(outputState.selectedInitialShape.label);
    setMarkerSize(outputState.markerSize === undefined ? markerSize : outputState.markerSize);
  };
  const downloadPlot = (outputState) => {
    setPlotTitle(outputState.plotTitle);
    setPicWidth(outputState.width);
    setPicHeight(outputState.height);
    setPicFormat(outputState.selectedColumn);
    setShouldDownload(true);
  };

  const handleAdmixOptionsCallback = (state) => {
    setAlphaVal(state.initialAlpha);
    setCertaintyVal(state.initialCertainty);
    setAdmixMode(state.mode === "Alpha" ? 0 : 1);
  };

  const onPressReset = () => {
    setNumClusters(2);
    setProgressBarType("Loader");
    setColumnRange([]);
    setSelectedFile(null);
    setImageURL("");
    setColumns(null);
    setData(null);
    setColoredData([]);
    setPressed(false);
    setClusterNames({});
    setAlphaVal(40);
    setAllActions([]);
    setSelectActions([]);
    setSelectedColumns([null, null, null]);
    setSelectedOption(null);
    setIsLoading(false);
    setClusterColors([]);
    setShow(true);
    setMultiValue([]);
    setDescribingValues([]);
    setSelectedDescribingColumn({ value: "None", label: "None" });
    setSelectedClusterMethod(null);
    setOutlierData([]);
    setShowOutputOptions(false);
    setSelectedColorShape(0);
    setAdmix([]);
    setAdmixOptionsLabelCheck(true);
    setPlotTitle("");
    setMappingIDColumn("");
    setPicHeight(600);
    setPicWidth(800);
    setPicFormat("png");
    setMetaData([]);
    setMetaDataColumns([]);
  };

  return (
    <div>
      {/* <NavigationBar></NavigationBar> */}
      {isLoading && (
        <div style={{}}>
          <ProgressBarTime totalTime={ProgressBarTimeInterval} type={"Loader"} isLoading={isLoading} />
        </div>
      )}

      <div className="container" style={styles.splitScreen}>
        <LeftPane
          handleClose={handleClose}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          UploadTabChange={UploadTabChange}
          samplePCAAdmixDataset2={samplePCAAdmixDataset2}
          handleProcessedPCA={handleProcessedPCA}
          handleProcessedAdmix={handleProcessedAdmix}
          handleUnprocessedPCA={handleUnprocessedPCA}
          handleTSNE2D={handleTSNE2D}
          handleTSNE3D={handleTSNE3D}
          runPCAir={runPCAir}
          runCluster={runCluster}
          runOutliers={runOutliers}
          allActions={allActions}
          removeOutliers={removeOutliers}
          onPressReset={onPressReset}
          styles={styles}
          fileChanged={fileChanged}
          setFileChanged={setFileChanged}
        />

        {/* <div className="block-example" style={styles.rightPane}> */}
        {!isLoading && (
          <CentralPane
            showScatterPlot={showScatterPlot}
            dendrogramPath={dendrogramPath}
            admix={admix}
            selectedUploadOption={selectedUploadOption}
            alphaVal={alphaVal}
            certaintyVal={certaintyVal}
            clusterNames={clusterNames}
            clusterColors={clusterColors}
            clusterNumberChange={clusterNumberChange}
            admixOptionsLabelCheck={admixOptionsLabelCheck}
            plotTitle={plotTitle}
            picWidth={picWidth}
            picHeight={picHeight}
            picFormat={picFormat}
            admixMode={admixMode}
          />
        )}
        {/* <div> */}
        <UpperPane
          axisRef={axisRef}
          selectedOption={selectedOption}
          onValueChangeDims={onValueChangeDims}
          selectedColumns={selectedColumns}
          selectActions={selectActions}
          handleSelectXChange={handleSelectXChange}
          handleSelectYChange={handleSelectYChange}
          handleSelectZChange={handleSelectZChange}
          selectedUploadOption={selectedUploadOption}
        />

        <RightPane
          downloadPlot={downloadPlot}
          selectedUploadOption={selectedUploadOption}
          selectActions={selectActions}
          multiValue={multiValue}
          handleMultiChange={handleMultiChange}
          selectedDescribingColumnColor={selectedDescribingColumnColor}
          handleColoredColumns={handleColoredColumns}
          selectedDescribingColumnShape={selectedDescribingColumnShape}
          handleShapeColumns={handleShapeColumns}
          OutlierData={OutlierData}
          data={data}
          handleMetaDataUpload={handleMetaDataUpload}
          onInputMetadataClick={onInputMetadataClick}
          allActions={allActions}
          setMappingIDColumn={setMappingIDColumn}
          alphaVal={alphaVal}
          certaintyVal={certaintyVal}
          admixMode={admixMode}
          admix={admix}
          handleAdmixOptionsCallback={handleAdmixOptionsCallback}
          columnRange={columnRange}
        clusterColors={clusterColors}
          setClusterColors={setClusterColors}
          clusterNames={clusterNames}
          numClusters={numClusters}
          markerSize={markerSize}
          handleTabOutputCallback={handleTabOutputCallback}
          showOutputOptions={showOutputOptions}
        />
      </div>
      {/* </div> */}
      {/* </div> */}
    </div>
  );
};

const styles = {
  page: {
    // display: "grid",
    // gridTemplateColumns: "1fr 4fr",
    // gridTemplateRows: "1fr",
  },
  splitScreen: {
    // display: "flex",
    // flexDirection: "column",
    // marginTop: "50px"
    // display: "grid",
    // gridTemplateColumns: "1fr 5fr",
    // gridTemplateAreas: 'left right',
  },

  // rightPane: {
  //   height: "91%",
  //   position: "fixed",
  //   display: "flex",
  //   flexDirection: "row",
  //   top: 0,
  //   right: 0,
  //   // width: "78%",
  //   // display: 'block',
  //   gridArea: "right",
  //   marginTop: "4%",
  //   marginRight: "10px",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  radioButtons: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
  },
  leftPane: {
    //   height: "100vh",
    //   position: "fixed",
    //   top: 0,
    //   // paddingTop: "20px",
    //   left: 0,
    //   gridArea: "left",
    //   width: "20%",
    //   // marginTop: "50px",
    //   color: "white",
    //   padding: "2%",
    //   // display: "block",
    //   // backgroundColor:"rgb(245, 246, 247)",
    //   backgroundColor: colors.gray,
    //   overflowY: "auto",
    //   overflowX: "hidden",
  },
  // dimensions: {
  //   position: "fixed",
  //   z_index: 1,
  //   top: "8%",
  //   overflow_x: "hidden",
  //   left: 0,
  //   marginLeft: "21%",
  //   width: "57%",
  //   display: "flex",
  //   flexDirection: "row",
  //   padding: "10px",
  //   backgroundColor: "#f5f6f7",
  //   borderRadius: 10,
  // },
  outputSettings: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },

  dropDown: {
    width: "21%",
    marginLeft: "2%",
  },
  describingColumnDropDown: {
    marginLeft: "3%",
    display: "flex",
    flexDirection: "row",
    marginTop: "2%",
  },
  // optionsContainer: {
  //   position: "fixed",
  //   right: "1%",
  //   top: 0,
  //   height: "89%",
  //   display: "flex",
  //   flexDirection: "column",
  //   width: "20%",
  //   padding: "10px",
  //   marginTop: "4.5%",
  //   backgroundColor: "#f5f6f7",
  //   borderRadius: 10,
  // },
};

export default App;
