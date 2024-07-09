import React, { useRef } from "react";
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
//this is used only in mobile view (625px or less)
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
  OutlierData,
  data,
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

  return (
    <div className="bottom">
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

        <TabPanel>
          <div
            style={{ backgroundColor: "#3b3f4e", color: "white", padding: 20, overflowY: "auto", overflowX: "hidden" }}
            className=""
          >
            <form style={{ marginTop: "1%" }}>
              <UploadAndVisualizeTab
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{}}>
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
                          alert("Please upload data first");
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
              />
            </TabPanel>
          </div>
        )}
        {(selectedUploadOption === "pcairandadmixture" || selectedUploadOption === "admixture") && (
          <div style={{ overflowY: "auto", overflowX: "hidden" }}>
            <TabPanel>
              <div
                style={{ height: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column" }}
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
