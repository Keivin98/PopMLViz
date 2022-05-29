import React, { Component } from "react";
import PropTypes from "prop-types";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";
import { AiFillCaretDown } from "react-icons/ai";
import PCAir from "./PCAir";
import { VscTypeHierarchy } from "react-icons/vsc";
import axios from "axios";
class UploadAndVisualizeTab extends Component {
  state = {
    selectedUploadOption: null,
    selectedFile: null,
    open: false,
    isLoading: false,
    ProgressBarType: "ProgressBar",
    ProgressBarTimeInterval: 80,
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

  runPCAir = () => {
    this.setState(
      {
        isLoading: true,
        ProgressBarType: "ProgressBar",
        ProgressBarTimeInterval: 80,
      },
      () => {
        this.props.onChange(this.state);
      }
    );
    const formData = {
      bedName: this.state.bedName,
      bimName: this.state.bimName,
      famName: this.state.famName,
      kinshipName: this.state.kinshipName,
    };

    axios
      .post(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:5000/api/runPCAIR`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((r) => {
        this.setState({
          isLoading: false,
        });
        this.props.onChange(this.state);
        this.props.processData(r.data, false);
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
        alert("Network error! Please check the request or try again.");
      });
  };
  PCAirChange = (st) => {
    this.setState({
      bedName: st.bedName,
      bimName: st.bimName,
      famName: st.famName,
      kinshipName: st.kinshipName,
    });
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
              width: "90%",
            }}
          >
            <VscTypeHierarchy
              size={30}
              style={{
                marginRight: "3%",
                transform: "rotate(180deg)",
                opacity: 0.5,
              }}
            />
            <label>Dimensionality Reduction</label>
          </div>
          <AiFillCaretDown style={{ marginTop: "3%" }} />
        </div>
        <Collapse in={this.state.open}>
          <div id="example-collapse-text">
            <div className="radio">
              <input
                type="radio"
                value="Correlation Matrix"
                checked={
                  this.state.selectedUploadOption === "Correlation Matrix"
                }
                onChange={this.onUploadValueChange}
              />
              <label style={{ paddingLeft: "10px" }}>PCA</label>
            </div>
            <div className="radio">
              <input
                type="radio"
                value="PC-AiR"
                checked={this.state.selectedUploadOption === "PC-AiR"}
                onChange={this.onUploadValueChange}
              />
              <label style={{ paddingLeft: "10px" }}> PC-AiR</label>
            </div>
            <div>
              <input
                type="radio"
                value="t-SNE 2D"
                checked={this.state.selectedUploadOption === "t-SNE 2D"}
                onChange={this.onUploadValueChange}
              />
              <label style={{ paddingLeft: "10px" }}> t-SNE 2D</label>
            </div>
            <div>
              <input
                type="radio"
                value="t-SNE 3D"
                checked={this.state.selectedUploadOption === "t-SNE 3D"}
                onChange={this.onUploadValueChange}
              />
              <label style={{ paddingLeft: "10px" }}> t-SNE 3D</label>
            </div>

            <div>
              {this.state.selectedUploadOption === "Correlation Matrix" && (
                <div
                  style={{
                    width: "300px",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                  }}
                >
                  <label style={{ fontStyle: "italic" }}>
                    expected: Correlation Matrix.
                  </label>
                </div>
              )}
              {(this.state.selectedUploadOption === "t-SNE 2D" ||
                this.state.selectedUploadOption === "t-SNE 3D") && (
                <div
                  style={{
                    width: "300px",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                  }}
                >
                  <label style={{ fontStyle: "italic" }}>
                    expected: PCA Data.
                  </label>
                </div>
              )}

              {this.state.selectedUploadOption === "PC-AiR" && (
                <div>
                  <PCAir onChange={this.PCAirChange} />
                  <Button
                    variant="outlined"
                    style={{
                      color: "#1891fb",
                      fontWeight: "bold",
                      height: "2%",
                      backgroundColor: "#ebeff7",
                    }}
                    onClick={() => {
                      this.runPCAir();
                    }}
                  >
                    Run PC-AiR
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}
UploadAndVisualizeTab.propTypes = {
  runPCAir: PropTypes.func,
  bedName: PropTypes.string,
  bimName: PropTypes.string,
  famName: PropTypes.string,
  kinshipName: PropTypes.string,
};

export default UploadAndVisualizeTab;
