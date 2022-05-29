import React, { Component } from "react";
import axios from "axios";
class RadioButtons extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  onValueChange(event) {
    this.setState({
      selectedOption: event.target.value,
    });
  }

  formSubmit(event) {
    event.preventDefault();
    console.log(this.state.selectedOption);
  }

  UploadDataset = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    // Details of the uploaded file
    console.log(this.state.selectedFile);

    // Request made to the backend api
    // Send formData object
    if (this.state.selectedOption === "Correlation Matrix") {
      axios
        .post(`localhost/uploadCM`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          return (
            <div>
              <button onClick={this.onFileUpload}>{response.data}</button>
            </div>
          );
        })
        .catch(() => {
          this.setState({
            isLoading: false,
          });
          alert("Network error! Please check the request or try again.");
        });
    } else {
      axios
        .post(`localhost/uploadPCA`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          return (
            <div>
              <button onClick={this.onFileUpload}>{response.data}</button>
            </div>
          );
        })
        .catch(() => {
          this.setState({
            isLoading: false,
          });
          alert("Network error! Please check the request or try again.");
        });
    }
  };

  render() {
    return (
      <form style={{ marginTop: "30px" }}>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="Correlation Matrix"
              checked={this.state.selectedOption === "Correlation Matrix"}
              onChange={this.onValueChange}
            />
            Correlation Matrix
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="PCA"
              checked={this.state.selectedOption === "PCA"}
              onChange={this.onValueChange}
            />
            PCA
          </label>
        </div>
        <button style={{ marginTop: "20px" }} onClick={this.UploadDataset}>
          {" "}
          Upload {this.state.selectedOption}{" "}
        </button>
      </form>
    );
  }
}

export default RadioButtons;
