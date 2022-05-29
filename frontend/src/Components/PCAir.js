import React, { Component } from "react";
import Loader from "react-loader-spinner";

class PCAir extends Component {
  state = {
    loading: false,
    bedName: "",
    bimName: "",
    famName: "",
    kinshipName: "",
  };
  handleBedRequest = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.append("file", ev.target.files[0]);
    data.append("filename", ev.target.value);
    this.setState({
      loading: true,
    });

    fetch(
      `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/uploadPCAIR`,
      {
        method: "POST",
        body: data,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data["filename"]);
        this.setState(
          {
            loading: false,
            bedName: data["filename"],
          },
          () => {
            this.props.onChange(this.state);
          }
        );
      })
      .catch(() => {
        alert("Network error! Please check the request or try again.");
        this.setState(
          {
            isLoading: false,
          },
          () => {
            this.props.onChange(this.state);
          }
        );
      });
  };

  handleKinshipRequest = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.append("file", ev.target.files[0]);
    data.append("filename", ev.target.value);
    this.setState({
      loading: true,
    });

    fetch(
      `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/uploadPCAIR`,
      {
        method: "POST",
        body: data,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data["filename"]);
        this.setState(
          {
            loading: false,
            kinshipName: data["filename"],
          },
          () => {
            this.props.onChange(this.state);
          }
        );
      })
      .catch(() => {
        alert("Network error! Please check the request or try again.");
        this.setState(
          {
            isLoading: false,
          },
          () => {
            this.props.onChange(this.state);
          }
        );
      });
  };
  handleFamRequest = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.append("file", ev.target.files[0]);
    data.append("filename", ev.target.value);
    this.setState({
      loading: true,
    });

    fetch(
      `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/uploadPCAIR`,
      {
        method: "POST",
        body: data,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data["filename"]);
        this.setState(
          {
            loading: false,
            famName: data["filename"],
          },
          () => {
            this.props.onChange(this.state);
          }
        );
      })
      .catch(() => {
        alert("Network error! Please check the request or try again.");
        this.setState(
          {
            isLoading: false,
          },
          () => {
            this.props.onChange(this.state);
          }
        );
      });
  };
  handleBimRequest = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.append("file", ev.target.files[0]);
    data.append("filename", ev.target.value);
    this.setState({
      loading: true,
    });

    fetch(
      `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/api/uploadPCAIR`,
      {
        method: "POST",
        body: data,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data["filename"]);
        this.setState(
          {
            loading: false,
            bimName: data["filename"],
          },
          () => {
            this.props.onChange(this.state);
          }
        );
      })
      .catch(() => {
        alert("Network error! Please check the request or try again.");
        this.setState(
          {
            isLoading: false,
          },
          () => {
            this.props.onChange(this.state);
          }
        );
      });
  };
  render() {
    return (
      <div style={styles.pcair}>
        <label>Upload necessary files for PC-AiR</label>
        <div style={styles.uploads}>
          <label style={{ marginRight: "10%" }}>.bed</label>
          <input type="file" accept=".bed" onChange={this.handleBedRequest} />
        </div>
        <div style={styles.uploads}>
          <label style={{ marginRight: "10%" }}>.bim</label>
          <input type="file" accept=".bim" onChange={this.handleBimRequest} />
        </div>
        <div style={styles.uploads}>
          <label style={{ marginRight: "10%" }}>.fam</label>
          <input type="file" accept=".fam" onChange={this.handleFamRequest} />
        </div>
        <div style={styles.uploads}>
          <label style={{ marginRight: "3%" }}>Kinship</label>
          <input
            type="file"
            accept=".txt"
            onChange={this.handleKinshipRequest}
          />
        </div>
        {this.state.loading && (
          <Loader
            type="TailSpin"
            color="#00BFFF"
            height="30"
            width="30"
            style={{ marginTop: "2%", marginLeft: "20%" }}
          />
        )}
      </div>
    );
  }
}

const styles = {
  pcair: {
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  uploads: {
    display: "flex",
    flexDirection: "row",
    padding: "2px",
  },
};
export default PCAir;
