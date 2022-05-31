import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";

class TabOutputOptions extends Component {
  state = {
    cluster_names: {},
    plotTitle: "",
  };
  showOutputOptions = () => {
    var num_clusters = this.props.uniqueClusters;
    if (num_clusters < 2) {
      num_clusters = 2;
    }
    return (
      <div style={{ padding: "4%" }}>
        <h6>Change plot title:</h6>
        <div style={{ marginTop: "10px" }}>
          <label style={{ width: "30%" }}>Plot Title</label>
          <input
            type="text"
            style={{ marginLeft: "5%", width: "60%" }}
            onChange={(e) => {
              this.setState({ plotTitle: e.target.value });
            }}
          />
        </div>
        {this.props.showClusters && (
          <div>
            <h6 style={{ marginTop: "10%" }}>Change cluster names:</h6>
            {[...Array(num_clusters)].map((_, index) => {
              return (
                <div style={{ marginTop: "10px" }}>
                  <label style={{ width: "30%" }}>Cluster {index}</label>
                  <input
                    type="text"
                    name={index}
                    style={{ marginLeft: "5%", width: "60%" }}
                    onChange={(e) => {
                      var new_cluster_names = this.state.cluster_names;
                      new_cluster_names[index] = e.target.value;
                      this.setState({ cluster_names: new_cluster_names });
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  render() {
    return (
      <div>
        {this.showOutputOptions()}
        <Button
          variant="outlined"
          onClick={(event) => {
            this.props.parentCallback(this.state);
            event.preventDefault();
          }}
          style={{
            marginLeft: "50%",
            marginTop: "10%",
          }}
        >
          Submit
        </Button>
      </div>
    );
  }
}

TabOutputOptions.propTypes = {
  uniqueClusters: PropTypes.number,
  showClusters: PropTypes.bool,
};

export default TabOutputOptions;
