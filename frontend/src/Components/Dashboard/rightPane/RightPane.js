import React from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import Select from "react-select";
import DownloadData from "./DownloadData";
import AdmixOptions from "./AdmixOptions";
import TabOutputOptions from "./TabOutputOptions";
import "react-tabs/style/react-tabs.css";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

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
  handleMetaDataUpload,
  onInputMetadataClick,
  allActions,
  setMappingIDColumn,
  alphaVal,
  certaintyVal,
  admix,
  handleAdmixOptionsCallback,
  columnRange,
  clusterColors,
  clusterNames,
  admixMode,
  numClusters,
  markerSize,
  handleTabOutputCallback,
  showOutputOptions,

}) => {
  return (
    <Tabs style={styles.optionsContainer}>
      <TabList>
        <Tab>Settings</Tab>
        <Tab>Output Options</Tab>
      </TabList>
      {selectedUploadOption !== "admixture" && selectedUploadOption !== "pcairandadmixture" && (
        <div>
          {" "}
          <TabPanel>
            <div className="row">
              <div className="row-md-8"></div>

              <div
                style={{
                  width: "90%",
                  marginTop: "3%",
                  marginLeft: "3%",
                }}
              >
                <label
                  style={{
                    fontWeight: "300",
                    fontSize: 18,
                    padding: "2%",
                  }}
                >
                  Describing Columns
                </label>
                <Select
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
                  <div style={styles.describingColumnDropDown}>
                    <label
                      style={{
                        fontSize: 14,
                        padding: "2%",
                        width: "30%",
                      }}
                    >
                      Identify by Colors
                    </label>
                    <div style={{ width: "62%", marginTop: "1%" }}>
                      <Select
                        value={selectedDescribingColumnColor}
                        options={multiValue}
                        onChange={handleColoredColumns}
                      />
                    </div>
                  </div>
                  <div style={styles.describingColumnDropDown}>
                    <label
                      style={{
                        fontSize: 14,
                        padding: "2%",
                        width: "30%",
                      }}
                    >
                      Identify by Shape
                    </label>
                    <div style={{ width: "62%", marginTop: "1%" }}>
                      <Select
                        value={selectedDescribingColumnShape}
                        disabled={OutlierData.length > 0}
                        options={multiValue}
                        onChange={handleShapeColumns}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                width: "90%",
                marginTop: "10%",
                marginLeft: "3%",
              }}
            >
              <label
                style={{
                  fontWeight: "300",
                  fontSize: 18,
                  padding: "2%",
                }}
              >
                Mapping ID Column
              </label>
              <Select
                placeholder="Mapping ID"
                options={allActions}
                onChange={(option) => {
                  setMappingIDColumn(option.label);
                }}
              />
              <label
                style={{
                  fontWeight: "300",
                  padding: "2%",
                  fontSize: 18,
                  marginTop: "10%",
                }}
              >
                Add Metadata
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt"
                  onChange={handleMetaDataUpload}
                  onClick={onInputMetadataClick}
                  disabled={data == null || data.length === 0}
                />
              </label>
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
          </TabPanel>
          <TabPanel style={styles.outputSettings}>
            <TabOutputOptions
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
              style={{
                width: "90%",
                marginLeft: "3%",
              }}
            >
              <AdmixOptions
                initialAlpha={alphaVal}
                initialCertainty={certaintyVal}
                name={selectedUploadOption === "pcairandadmixture" ? "Alpha" : "Certainty"}
                parentCallback={handleAdmixOptionsCallback}
                mode={admixMode}
                disabled={admix.length === 0}
              />
            </div>
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
          </TabPanel>
          <TabPanel style={styles.outputSettings}>
            <TabOutputOptions
              uniqueClusters={numClusters}
              parentCallback={handleTabOutputCallback}
              showClusters={showOutputOptions}
              markerSize={markerSize}
            />
          </TabPanel>
        </div>
      )}
    </Tabs>
  );
};

const styles = {
  optionsContainer: {
    position: "fixed",
    right: "1%",
    gridArea: "right",
    top: 0,
    height: "89%",
    display: "flex",
    flexDirection: "column",
    width: "18%",
    padding: "10px",
    // marginTop: "4.5%",
    marginTop: "10px",
    backgroundColor: "#f5f6f7",
    borderRadius: 10,
    overflowY: "auto",
    overflowX: "hidden",
  },
  describingColumnDropDown: {
    marginLeft: "3%",
    display: "flex",
    flexDirection: "row",
    marginTop: "2%",
  },
  outputSettings: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
};

export default RightPane;
