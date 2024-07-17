import React, { Component, useCallback, useState } from "react";
import PropTypes from "prop-types";

import Collapse from "react-bootstrap/Collapse";
import { AiFillCaretDown } from "react-icons/ai";
import { FcScatterPlot } from "react-icons/fc";
import DataUploadModal from "./DataUploadModal";

function UploadAndVisualizeTab({
  onChange,
  samplePCAAdmixDataset,
  processedPCA,
  processedAdmix,
  unprocessedPCA,
  tsne2d,
  tsne3d,
  runPCAir,
  fileChanged,
  setFileChanged,
  resetSaveState,
  handleClose,
  modalOpen,
  setModalOpen,
  processData,
  setIsMainPageLoading,
  uploadSavedData,
  selectedColumns
}) {
  const [selectedUploadOption, setSelectedUploadOption] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);
  // console.log(processData)
  const [open, setOpen] = useState(false);

  const onUploadValueChange = useCallback((event) => {
    const newValue = event.target.value;
    setSelectedUploadOption(newValue);
    if (onChange) {
      onChange({ selectedUploadOption: newValue });
    }
  }, []);

  return (
    <div>
      <div
        style={
          {
            // display: "flex",
            // marginBottom: "5%",
            // justifyContent: "center",
            // alignItems: "center",
            // flexDirection: "row",
          }
        }
        onClick={() => setOpen(!open)}
      >
        <div
          style={{
            // display: "flex",
            flexDirection: "row",
            // width: "80%",
          }}
        >
          {/* <FcScatterPlot size={30} style={{ marginRight: "3%", opacity: 0.5 }} /> */}
          {/* <label> Upload and Preprocess </label> */}
          <DataUploadModal
            modalOpen={modalOpen}
            uploadSavedData={uploadSavedData}
            setModalOpen={setModalOpen}
            handleClose={handleClose}
            fileChanged={fileChanged}
            setFileChanged={setFileChanged}
            setIsMainPageLoading={setIsMainPageLoading}
            samplePCAAdmixDataset={samplePCAAdmixDataset}
            processedPCA={processedPCA}
            processedAdmix={processedAdmix}
            unprocessedPCA={unprocessedPCA}
            resetSaveState={resetSaveState}
            tsne2d={tsne2d}
            tsne3d={tsne3d}
            selectedColumns={selectedColumns}
            runPCAir={runPCAir}
            processData={processData}
          />
        </div>
        {/* <AiFillCaretDown style={{marginTop: "3%"}} /> */}
      </div>
    </div>
  );
}

// UploadAndVisualizeTab.propTypes = {
//   data: PropTypes.array,
//   samplePCAAdmixDataset: PropTypes.func,
//   processedPCA: PropTypes.func,
//   processedAdmix: PropTypes.func,
//   unprocessedPCA: PropTypes.func,
//   tsne2d: PropTypes.func,
//   tsne3d: PropTypes.func,
//   runPCAir: PropTypes.func,
//   onChange: PropTypes.func,
// };

export default UploadAndVisualizeTab;

{
  /* <Collapse in={this.state.open}>
          <div id="example-collapse-text">
            <div className="radio">
              <input
                type="radio"
                value="PCA"
                checked={this.state.selectedUploadOption === "PCA"}
                onChange={this.onUploadValueChange}
              />
              <label style={{paddingLeft: "10px"}}> PCA</label>
            </div> */
}

{
  /* <div className="radio">
              <input
                type="radio"
                value="admixture"
                checked={this.state.selectedUploadOption === "admixture"}
                onChange={this.onUploadValueChange}
              />
              <label style={{ paddingLeft: "10px" }}> Admixture</label>
            </div> */
}

//     <div className="radio">
//       <input
//         type="radio"
//         value="pcairandadmixture"
//         checked={
//           this.state.selectedUploadOption === "pcairandadmixture"
//         }
//         onChange={this.onUploadValueChange}
//       />
//       <label style={{paddingLeft: "10px"}}> PCA and Admixture</label>
//     </div>
//   </div>
// </Collapse>
