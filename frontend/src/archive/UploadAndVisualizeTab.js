import React, {Component} from "react";
import PropTypes from "prop-types";
import Collapse from "react-bootstrap/Collapse";
import {AiFillCaretDown} from "react-icons/ai";
import {FcScatterPlot} from "react-icons/fc";
import DataUploadModal from "./DataUploadModal";

class UploadAndVisualizeTab extends Component {
  state = {
    selectedUploadOption: null,
    selectedFile: null,
    open: false,
  };
  setOpen = (open) => {
    this.setState({open: open});
  };
  onUploadValueChange = (event) => {
    this.setState(
      {
        selectedUploadOption: event.target.value,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state);
        }
      }
    );
  };
  render() {
    return (
      <div>
        <div
          style={{
            marginBottom: "5%",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
          onClick={() => this.setOpen(!this.state.open)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "80%",
            }}
          >
            <FcScatterPlot
              size={30}
              style={{marginRight: "3%", opacity: 0.5}}
            />
            {/* <label> Upload and Preprocess </label> */}
            <DataUploadModal
              samplePCAAdmixDataset={this.props.samplePCAAdmixDataset}
              processedPCA={this.props.processedPCA}
              processedAdmix={this.props.processedAdmix}
              unprocessedPCA={this.props.unprocessedPCA}
              tsne2d={this.props.tsne2d}
              tsne3d={this.props.tsne3d}
              runPCAir={this.props.runPCAir}
            />
          </div>
          {/* <AiFillCaretDown style={{marginTop: "3%"}} /> */}
        </div>
      </div>
    );
  }
}

UploadAndVisualizeTab.propTypes = {
  data: PropTypes.array,
  samplePCAAdmixDataset: PropTypes.func,
  processedPCA: PropTypes.func,
  processedAdmix: PropTypes.func,
  unprocessedPCA: PropTypes.func,
  tsne2d: PropTypes.func,
  tsne3d: PropTypes.func,
  runPCAir: PropTypes.func,
};

export default UploadAndVisualizeTab;


{/* <Collapse in={this.state.open}>
          <div id="example-collapse-text">
            <div className="radio">
              <input
                type="radio"
                value="PCA"
                checked={this.state.selectedUploadOption === "PCA"}
                onChange={this.onUploadValueChange}
              />
              <label style={{paddingLeft: "10px"}}> PCA</label>
            </div> */}

{/* <div className="radio">
              <input
                type="radio"
                value="admixture"
                checked={this.state.selectedUploadOption === "admixture"}
                onChange={this.onUploadValueChange}
              />
              <label style={{ paddingLeft: "10px" }}> Admixture</label>
            </div> */}

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