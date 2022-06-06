import React, { Component } from "react";
import PropTypes from "prop-types";
import Collapse from "react-bootstrap/Collapse";
import { AiFillCaretDown } from "react-icons/ai";
import { FcScatterPlot } from "react-icons/fc";
class DimensionalityReductionTab extends Component {
  state = {
    selectedUploadOption: null,
    selectedFile: null,
    open: false,
  };
  setOpen = (open) => {
    this.setState({ open: open });
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
              style={{ marginRight: "3%", opacity: 0.5 }}
            />
            <label>Upload and Visualize </label>
          </div>
          <AiFillCaretDown style={{ marginTop: "3%" }} />
        </div>

        <Collapse in={this.state.open}>
          <div id="example-collapse-text">
            <div className="radio">
              <input
                type="radio"
                value="PCA"
                checked={this.state.selectedUploadOption === "PCA"}
                onChange={this.onUploadValueChange}
              />
              <label style={{ paddingLeft: "10px" }}> PCA</label>
            </div>

            {/* <div className="radio">
              <input
                type="radio"
                value="admixture"
                checked={this.state.selectedUploadOption === "admixture"}
                onChange={this.onUploadValueChange}
              />
              <label style={{ paddingLeft: "10px" }}> Admixture</label>
            </div> */}

            <div className="radio">
              <input
                type="radio"
                value="pcairandadmixture"
                checked={
                  this.state.selectedUploadOption === "pcairandadmixture"
                }
                onChange={this.onUploadValueChange}
              />
              <label style={{ paddingLeft: "10px" }}> PCA and Admixture</label>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

DimensionalityReductionTab.propTypes = {
  data: PropTypes.array,
};

export default DimensionalityReductionTab;
