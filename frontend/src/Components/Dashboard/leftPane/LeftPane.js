import React from "react";
import { Button } from "@material-ui/core";
import UploadAndVisualizeTab from "./UploadAndVisualizeTab";
import ClusteringAlgorithmsTab from "./ClusteringAlgorithmsTab";
import OutlierDetectionTab from "./OutlierDetectionTab";
import colors from "../../../config/colors";
import { useNavigate } from "react-router-dom";
import font from "../../../config/font";
import "./leftpane.css";
import "../dashboard.css";

const LeftPane = ({
  UploadTabChange,
  samplePCAAdmixDataset2,
  setProgressBarType,
  handleProcessedPCA,
  handleProcessedAdmix,
  handleUnprocessedPCA,
  resetSaveState,
  handleTSNE2D,
  handleTSNE3D,
  runPCAir,
  runCluster,
  runOutliers,
  allActions,
  removeOutliers,
  onPressReset,
  styles,
  fileChanged,
  setFileChanged,
  handleClose,
  modalOpen,
  setModalOpen,
  selectedColumns,
  processData,
  uploadSavedData,
  setIsMainPageLoading,
  runUMAP2D,
  runUMAP3D
}) => {
  const navigate = useNavigate();
  // console.log(processData)

  function handleHomeClick() {
    navigate("/");
  }
  return (
    <div className="leftpane grid-l">
      <div
        className="logo-container"
        onClick={handleHomeClick}
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "5px",
          marginBottom: "50px",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <img src="../../../logo.jpeg" style={{ height: "40px", marginRight: "10px" }} />
        <span style={{ fontSize: "20px", fontWeight: "500", fontFamily: font.primaryFont }}>PopMLVis</span>
      </div>
      <form style={{ marginTop: "1%" }}>
        <UploadAndVisualizeTab
          setProgressBarType={setProgressBarType}
          processData={processData}
          modalOpen={modalOpen}
          uploadSavedData={uploadSavedData}
          setModalOpen={setModalOpen}
          resetSaveState={resetSaveState}
          handleClose={handleClose}
          fileChanged={fileChanged}
          setFileChanged={setFileChanged}
          onChange={UploadTabChange}
          samplePCAAdmixDataset={samplePCAAdmixDataset2}
          processedPCA={handleProcessedPCA} // handleFileUpload
          processedAdmix={handleProcessedAdmix} // handleAdmixFileUpload1
          unprocessedPCA={handleUnprocessedPCA}
          tsne2d={handleTSNE2D}
          tsne3d={handleTSNE3D}
          runUMAP2D={runUMAP2D}
          runUMAP3D={runUMAP3D}
          setIsMainPageLoading={setIsMainPageLoading}
          runPCAir={runPCAir}
          selectedColumns={selectedColumns}
        />
      </form>
      <hr style={{ backgroundColor: "white", height: 2, opacity: 1 }} />
      <ClusteringAlgorithmsTab onChange={runCluster} />
      <hr style={{ backgroundColor: "white", height: 2, opacity: 1 }} />
      <OutlierDetectionTab
        onChange={runOutliers}
        numFeatures={
          allActions.filter((elem) => {
            return Array.isArray(elem) || elem.label.includes("PC") || elem.label.includes("TSNE");
          }).length
        }
        allActions={allActions}
        removeOutliers={removeOutliers}
      />
      <div style={{ marginTop: "20%", display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          style={{
            color: "red",
            fontWeight: "bold",
            fontStyle: "italic",
            fontFamily: font.primaryFont,
            backgroundColor: "#ebeff7",
          }}
          onClick={onPressReset}
        >
          RESET
        </Button>
        {/* <div style={{height: 1000}}></div> */}
      </div>
    </div>
  );
};

export default LeftPane;
