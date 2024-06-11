import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import font from "../../../config/font";

const DownloadData = ({
  data,
  OutlierData,
  clusterColors,
  clusterNames,
  admixData,
  alphaVal: initialAlphaVal,
  certaintyVal: initialCertaintyVal,
  admixMode: initialAdmixMode,
}) => {
  const [outlierCheck, setOutlierCheck] = useState(false);
  const [clusterCheck, setClusterCheck] = useState(false);
  const [admixCheck, setAdmixCheck] = useState(false);
  const [downloadableData, setDownloadableData] = useState([]);
  const [alphaVal, setAlphaVal] = useState(initialAlphaVal);
  const [certaintyVal, setCertaintyVal] = useState(initialCertaintyVal);
  const [admixMode, setAdmixMode] = useState(initialAdmixMode);

  useEffect(() => {
    setDownloadableData(data);
  }, [data]);

  useEffect(() => {
    setAlphaVal(initialAlphaVal);
    setCertaintyVal(initialCertaintyVal);
    setAdmixMode(initialAdmixMode);
  }, [initialAlphaVal, initialCertaintyVal, initialAdmixMode]);

  const removeOutliers = () => {
    setOutlierCheck(!outlierCheck);
    let newData = [];
    for (let i = 0; i < data.length; i++) {
      let row = downloadableData.length > 0 ? downloadableData[i] : data[i];
      if (!clusterCheck) {
        row = Object.fromEntries(Object.entries(row).filter(([key]) => key !== "cluster"));
      }
      const outlierInp = OutlierData[i];
      row = { ...row, outlier: outlierInp };
      newData = [...newData, row];
    }
    setDownloadableData(newData);
  };

  const detectClusters = () => {
    if (clusterCheck) {
      setClusterCheck(!clusterCheck);
    } else {
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        let row = downloadableData.length > 0 ? downloadableData[i] : data[i];
        if (!outlierCheck) {
          row = Object.fromEntries(Object.entries(row).filter(([key]) => key !== "outlier"));
        }
        row = { ...row, cluster: clusterNames[clusterColors[i]] };
        newData = [...newData, row];
      }
      setClusterCheck(!clusterCheck);
      setDownloadableData(newData);
    }
  };

  const assignClusterToRow1 = (row) => {
    const parsedRow = Object.values(row).map((a) => parseFloat(a));
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    return rowDescending[0] < initialAlphaVal / 100 ? -1 : parsedRow.indexOf(rowDescending[0]);
  };

  const assignClusterToRow2 = (row) => {
    const parsedRow = Object.values(row).map((a) => parseFloat(a));
    const rowDescending = [...parsedRow].sort((a, b) => b - a);
    return rowDescending[0] - rowDescending[1] < initialCertaintyVal / 100.0 ? -1 : parsedRow.indexOf(rowDescending[0]);
  };

  const mergeData = (allData, additionalColumn) => {
    const undefinedValue = -1;
    return allData.map((elem, index) => {
      return {
        ...elem,
        admixCluster: additionalColumn[index] === undefinedValue ? "undefined" : clusterNames[additionalColumn[index]] ?? additionalColumn[index],
      };
    });
  };

  const admixClustering = () => {
    if (admixCheck) {
      setAdmixCheck(!admixCheck);
    } else {
      let clusters = [];
      for (let i = 0; i < admixData.length; i++) {
        const row_i = admixData[i];
        let cluster = initialAdmixMode === 0 ? assignClusterToRow1(row_i) : assignClusterToRow2(row_i);
        clusters.push(cluster);
      }
      const mergedData = downloadableData.length > 0 ? mergeData(downloadableData, clusters) : mergeData(data, clusters);
      setDownloadableData(mergedData);
      setAdmixCheck(!admixCheck);
    }
  };

  return (
    <div>
      <div className="block-example border-light" style={styles.download}>
        <label>
          <input
            name="outliers"
            type="checkbox"
            checked={outlierCheck}
            disabled={OutlierData.length === 0}
            onClick={removeOutliers}
          />
          {"\t"} Remove Outliers
        </label>
        <label>
          <input
            name="clustering"
            type="checkbox"
            checked={clusterCheck}
            onChange={detectClusters}
            disabled={clusterColors.length === 0}
          />
          {"\t"} Include Clustering Info
        </label>
        <label>
          <input
            name="clustering"
            type="checkbox"
            checked={admixCheck}
            onChange={admixClustering}
            disabled={admixData.length === 0}
          />
          {"\t"} Include Admix Clustering
        </label>
        <Button style={{fontFamily: font.primaryFont}} variant="outlined">
          <CSVLink
            data={downloadableData.length === 0 ? data : downloadableData}
            filename={"popmlvis_analysis.csv"}
            onClick={() => {
              setClusterCheck(false);
              setOutlierCheck(false);
            }}
          >
            Download Data
          </CSVLink>
        </Button>
      </div>
    </div>
  );
};

DownloadData.propTypes = {
  data: PropTypes.array,
  OutlierData: PropTypes.array,
  clusterColors: PropTypes.array,
  clusterNames: PropTypes.object,
  admixData: PropTypes.array,
  alphaVal: PropTypes.number,
  certaintyVal: PropTypes.number,
  admixMode: PropTypes.number,
};

const styles = {
  download: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    bottom: "6%",
    right: "4%",
    width: "15%",
    padding: "20px",
    border: `3px solid`,
    borderRadius: 10,
  },
};

export default DownloadData;
