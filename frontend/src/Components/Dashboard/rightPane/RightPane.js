import React, { useContext, useRef, useState } from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import Select from "react-select";
import DownloadData from "./DownloadData";
import AdmixOptions from "./AdmixOptions";
import TabOutputOptions from "./TabOutputOptions";
import "react-tabs/style/react-tabs.css";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import AppButton from "../../AppButton";
import { MdOutlineBorderColor } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import Modal from "@mui/material/Modal";
import "../dashboard.css";
import "./rightpane.css";
import { AuthContext } from "../../../config/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RightPane = ({
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
  DownloadButton,
  handleMetaDataUpload,
  onInputMetadataClick,
  allActions,
  setMappingIDColumn,
  alphaVal,
  certaintyVal,
  admix,
  handleAdmixOptionsCallback,
  columnRange,
  setClusterColors,
  clusterColors,
  clusterNames,
  admixMode,
  numClusters,
  markerSize,
  handleTabOutputCallback,
  showOutputOptions,
  downloadPlot,
  selectedColumns
}) => {
  const uploadRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataNameModalVisible, setDataNameModalVisible] = useState(false);
  const [dataName, setDataName] = useState("");

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}`,
    withCredentials: true, // Ensure credentials (cookies) are sent with requests
  });

  // Function to check if access token is valid
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
      throw error;
    }
  };

  // Function to perform authenticated requests
  const postSavedData = async () => {
    // const csvData = await converter.json2csv(data);
    // const blob = new Blob([csvData], { type: "text/csv" });
    // const formData = new FormData();
    // formData.append("file", blob, "popmlvis_analysis.csv");
    try {
      const isValid = await checkAccessTokenValidity();
      if (!isValid) {
        const newAccessToken = await refreshAccessToken();
        const response = await api.post(
          "/save",
          { data: data, name: dataName, axis: selectedColumns},
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );
        console.log(response.data);
        console.log(selectedColumns)
        console.log("data is fetched!");
        return response.data;
      } else {
        const response = await api.post(
          "/save",
          { data: data, name: dataName, axis: selectedColumns},
          { withCredentials: true }
        );
        console.log(response.data);
        console.log(selectedColumns)
        return response.data;
      }
    } catch (error) {
      if(error.response && error.response.status === 400) {
        alert("Data with the same name already exists. Please choose another name")
      }
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  function handleSave() {
    if (!user) {
      setModalVisible(true);
    }
    if (!data) {
      alert("Please make sure to upload a dataset first");
      return;
    }
    setDataNameModalVisible(true);
  }
  return (
    <>
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

      <Modal open={dataNameModalVisible} onClose={() => setDataNameModalVisible(false)}>
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
          <h2 style={{ textAlign: "center", marginTop: 20 }}>Please enter the data name</h2>
          <form
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            onSubmit={() => {
              setDataNameModalVisible(false);
              postSavedData()
            }}
          >
            <input
              required
              type="text"
              style={{ width: 150, marginTop: 30, borderRadius: 10, paddingLeft: 10, paddingRight: 10 }}
              onChange={(e) => setDataName(e.target.value)}
            />
            <AppButton style={{ marginTop: 20, fontSize: 20, minWidth: 70 }} title={"save"} type="submit"></AppButton>
          </form>
        </div>
      </Modal>

      <div className="right-pane">
        <Tabs className={"optionsContainer grid-r"}>
          <TabList className="tab-list">
            <Tab className="tab">
              <IoMdSettings />
            </Tab>
            <Tab className="tab">
              <MdOutlineBorderColor />
            </Tab>
          </TabList>
          {selectedUploadOption !== "admixture" && selectedUploadOption !== "pcairandadmixture" && (
            <div>
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
            <div>
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
                  DownloadButton={DownloadButton}
                />
              </TabPanel>
            </div>
          )}
        </Tabs>
        <AppButton
          className={"save-button"}
          style={{ width: "100%", marginTop: 10, marginBottom: 20 }}
          title={"save"}
          onClick={handleSave}
        ></AppButton>
      </div>
    </>
  );
};

const styles = {
  // optionsContainer: {
  //   position: "fixed",
  //   right: "1%",
  //   gridArea: "right",
  //   top: 0,
  //   height: "98%",
  //   display: "flex",
  //   flexDirection: "column",
  //   width: "18%",
  //   padding: "10px",
  //   marginBottom: 10,
  //   // marginTop: "4.5%",
  //   marginTop: "10px",
  //   backgroundColor: "#f5f6f7",
  //   borderRadius: 10,
  //   overflowY: "auto",
  //   overflowX: "hidden",
  // },
  // describingColumnDropDown: {
  //   marginLeft: "3%",
  //   display: "flex",
  //   flexDirection: "row",
  //   marginTop: "2%",
  // },
  // outputSettings: {
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "space-around",
  // },
};

export default RightPane;
