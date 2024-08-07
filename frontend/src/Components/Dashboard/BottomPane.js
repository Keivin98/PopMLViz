import React, { useRef, useState } from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import Select from "react-select";
import DownloadData from "./rightPane/DownloadData";
import AdmixOptions from "./rightPane/AdmixOptions";
import TabOutputOptions from "./rightPane/TabOutputOptions";
import "react-tabs/style/react-tabs.css";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import AppButton from "../AppButton";
import { MdOutlineBorderColor } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaFileUpload } from "react-icons/fa";
import { Button } from "@material-ui/core";
import UploadAndVisualizeTab from "./leftPane/UploadAndVisualizeTab";
import ClusteringAlgorithmsTab from "./leftPane/ClusteringAlgorithmsTab";
import OutlierDetectionTab from "./leftPane/OutlierDetectionTab";
import font from "../../config/font";
import "./leftPane/leftpane.css";
import "./dashboard.css";
import "./rightPane/RightPane";
import ErrorMessage from "../ErrorMessage";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";




//this is used only in mobile view (625px or less), if you see an unexpected error that says function x is not defined, this is becuase you didnt pass a param here, you only passed it to the leftpane for , make sure to pass new params here too
export default function BottomPane({
  downloadPlot,
  selectedUploadOption,
  selectActions,
  multiValue,
  handleMultiChange,
  selectedDescribingColumnColor,
  handleColoredColumns,
  selectedDescribingColumnShape,
  handleShapeColumns,
  dataNameModalVisible,
  setDataNameModalVisible,
  OutlierData,
  data,
  setProgressBarType,
  handleMetaDataUpload,
  onInputMetadataClick,
  allActions,
  setMappingIDColumn,
  alphaVal,
  certaintyVal,
  resetSaveState,
  admixMode,
  admix,
  handleAdmixOptionsCallback,
  columnRange,
  clusterColors,
  setClusterColors,
  clusterNames,
  numClusters,
  uploadSavedData,
  markerSize,
  handleTabOutputCallback,
  showOutputOptions,
  handleClose,
  modalOpen,
  setModalOpen,
  UploadTabChange,
  samplePCAAdmixDataset2,
  handleProcessedPCA,
  handleProcessedAdmix,
  handleUnprocessedPCA,
  processData,
  setIsMainPageLoading,
  handleTSNE2D,
  handleTSNE3D,
  runUMAP2D,
  runUMAP3D,
  runPCAir,
  runCluster,
  runOutliers,
  removeOutliers,
  onPressReset,
  styles,
  fileChanged,
  setFileChanged,
}) {
  const uploadRef = useRef(null);
  const navigate = useNavigate()
  const [modalVisible, setModalVisible] = useState(false);
  const api = axios.create({
    baseURL: `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}`,
    withCredentials: true, // Ensure credentials (cookies) are sent with requests
  });
  const checkAccessTokenValidity = async () => {
    try {
      await api.get("/verify");
      return true;
    } catch (error) {
      return false;
    }
  };

  // Function to refresh access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const response = await api.post("/refresh");
      return response.data.access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      setModalVisible(true);
      throw error;
    }
  };
  async function handleSave() {
    const isValid = await checkAccessTokenValidity();
    let newAccessToken;
    if (!isValid) {
      newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        return;
      }
    }

    if (!data) {
      ErrorMessage("Please make sure to upload a dataset first");
      return;
    }
    setDataNameModalVisible(true);
  }
  return (
    <div className="bottom">
      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <div
          style={{
            top: "50%",
            left: "50%",
            position: "absolute",
            width: "50%",
            backgroundColor: "white",
            transform: "translate(-50%, -50%)",
            borderRadius: 30,
            padding: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minWidth: 250,
          }}
        >
          <h2 style={{ textAlign: "center", marginTop: 20 }}>Please login to save your work</h2>
          <AppButton
            style={{ marginTop: 20, fontSize: 20, width: "30%", minWidth: 70 }}
            title={"login"}
            onClick={() => navigate("/login")}
          ></AppButton>
        </div>
      </Modal>
      <Tabs className={""}>
        <TabList style={{ marginBottom: 1 }} className="tab-list">
          <Tab className="tab">
            <FaFileUpload />
          </Tab>
          <Tab className="tab">
            <IoMdSettings />
          </Tab>
          <Tab className="tab">
            <MdOutlineBorderColor />
          </Tab>
        </TabList>
        <AppButton
          // className={"save-button"}
          style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
          title={"save"}
          onClick={handleSave}
        ></AppButton>

        <TabPanel>
          <div
            style={{ backgroundColor: "#3b3f4e", height: "100%", color: "white", padding: 20, overflowY: "auto", overflowX: "hidden" }}
            className=""
          >
            <form style={{ marginTop: "1%" }}>
              <UploadAndVisualizeTab
                setProgressBarType={setProgressBarType}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleClose={handleClose}
                fileChanged={fileChanged}
                resetSaveState={resetSaveState}
                setFileChanged={setFileChanged}
                onChange={UploadTabChange}
                samplePCAAdmixDataset={samplePCAAdmixDataset2}
                processedPCA={handleProcessedPCA} // handleFileUpload
                processedAdmix={handleProcessedAdmix} // handleAdmixFileUpload1
                unprocessedPCA={handleUnprocessedPCA}
                tsne2d={handleTSNE2D}
                uploadSavedData={uploadSavedData}
                tsne3d={handleTSNE3D}
                runUMAP2D={runUMAP2D}
                runUMAP3D={runUMAP3D}
                processData={processData}
                setIsMainPageLoading={setIsMainPageLoading}
                runPCAir={runPCAir}
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
        </TabPanel>

        {selectedUploadOption !== "admixture" && selectedUploadOption !== "pcairandadmixture" && (
          <div style={{}}>
            <TabPanel>
              <div style={{ display: "flex", flexDirection: "column",  backgroundColor: 'rgb(245, 246, 247)', }}>
                <div style={{backgroundColor: "rgb(245, 246, 247)"}}>
                  <div className="row-md-8"></div>

                  <div
                    style={{
                      width: "90%",
                      marginTop: "3%",
                      marginLeft: "3%",
                    }}
                  >
                    <label className="form-label">Describing Columns</label>
                    <Select
                      className="select-settings"
                      name="filters"
                      placeholder="Filters"
                      value={multiValue.filter((elem) => {
                        return elem.label !== "None";
                      })}
                      options={selectActions}
                      onChange={handleMultiChange}
                      isMulti
                    />
                  </div>
                  {multiValue.length > 0 && (
                    <div>
                      <div className="describingColumnDropDown" style={styles.describingColumnDropDown}>
                        <label className="form-sub-label">Identify by Colors</label>
                        <div style={{ width: "100%", marginTop: "1%" }}>
                          <Select
                            className="select-settings"
                            value={selectedDescribingColumnColor}
                            options={multiValue}
                            onChange={handleColoredColumns}
                          />
                        </div>
                      </div>
                      <div className="describingColumnDropDown">
                        <label className="form-sub-label">Identify by Shape</label>
                        <div style={{ width: "100%", marginTop: "1%" }}>
                          <Select
                            className="select-settings"
                            value={selectedDescribingColumnShape}
                            disabled={OutlierData.length > 0}
                            options={multiValue}
                            onChange={handleShapeColumns}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      width: "90%",
                      marginTop: "10%",
                      marginLeft: "3%",
                    }}
                  >
                    <label className="form-label">Mapping ID Column</label>
                    <Select
                      placeholder="Mapping ID"
                      className="select-settings"
                      options={allActions}
                      onChange={(option) => {
                        setMappingIDColumn(option.label);
                      }}
                    />
                    <AppButton
                      style={{ width: "100%", marginTop: 20 }}
                      title={"Add Metadata"}
                      className={"add-metadata-button"}
                      // defaultButton
                      onClick={() => {
                        if (data == null || data.length === 0) {
                          ErrorMessage("please upload data first");
                          return;
                        }
                        uploadRef.current.click();
                      }}
                      // disabled={data == null || data.length === 0}
                    ></AppButton>
                    <input
                      ref={uploadRef}
                      type="file"
                      accept=".csv,.xlsx,.xls,.txt"
                      onChange={handleMetaDataUpload}
                      onClick={onInputMetadataClick}
                      disabled={data == null || data.length === 0}
                      style={{ display: "none" }}
                    />
                    {/* <label
                    style={{
                      fontWeight: "300",
                      padding: "2%",
                      fontSize: 18,
                      marginTop: "10%",
                    }}
                  >
                    Add Metadata
                  </label> */}
                  </div>
                </div>

                {data !== null && (
                  <DownloadData
                    data={data}
                    clusterColors={clusterColors}
                    OutlierData={OutlierData}
                    clusterNames={clusterNames}
                    admixData={admix}
                    alphaVal={alphaVal}
                    certaintyVal={certaintyVal}
                    admixMode={admixMode}
                  />
                )}
              </div>
            </TabPanel>
            <TabPanel style={styles.outputSettings}>
              <TabOutputOptions
                setClusterColors={setClusterColors}
                downloadPlot={downloadPlot}
                uniqueClusters={numClusters}
                parentCallback={handleTabOutputCallback}
                showClusters={showOutputOptions}
                markerSize={markerSize}
                clusterNames={clusterNames}
              />
            </TabPanel>
          </div>
        )}
        {(selectedUploadOption === "pcairandadmixture" || selectedUploadOption === "admixture") && (
          <div style={{ overflowY: "auto", overflowX: "hidden", }}>
            <TabPanel>
              <div
                style={{ height: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column",  backgroundColor: 'rgb(245, 246, 247)', padding: 30}}
              >
                <AdmixOptions
                  initialAlpha={alphaVal}
                  initialCertainty={certaintyVal}
                  name={selectedUploadOption === "pcairandadmixture" ? "Alpha" : "Certainty"}
                  parentCallback={handleAdmixOptionsCallback}
                  mode={admixMode}
                  disabled={admix.length === 0}
                />

                <div>
                  {data !== null && (
                    <DownloadData
                      data={data}
                      clusterColors={clusterColors}
                      OutlierData={OutlierData}
                      columnRange={columnRange}
                      clusterNames={clusterNames}
                      admixData={admix}
                      alphaVal={alphaVal}
                      certaintyVal={certaintyVal}
                      admixMode={admixMode}
                    />
                  )}
                </div>
              </div>
            </TabPanel>
            <TabPanel className="outputSettings">
              <TabOutputOptions
                uniqueClusters={numClusters}
                parentCallback={handleTabOutputCallback}
                clusterColors={clusterColors}
                showClusters={showOutputOptions}
                clusterNames={clusterNames}
                markerSize={markerSize}
              />
            </TabPanel>
          </div>
        )}
        {/* <TabPanel>
          <div style={{ backgroundColor: "red", height: "100%", width: "100%" }}></div>
        </TabPanel>
        <TabPanel>
          <div style={{ backgroundColor: "blue", height: "100%", width: "100%" }}></div>
        </TabPanel>
        <TabPanel>
          <div style={{ backgroundColor: "green", height: "100%", width: "100%" }}></div>
        </TabPanel> */}
      </Tabs>
    </div>
  );
}
