import React, { Component } from "react";
import { Button } from "@material-ui/core";

class Incrementor extends Component {
  state = {
    num_clusters: 2,
  };
  DecreaseItem = () => {
    if (!(this.state.num_clusters <= 2)) {
      this.setState({ num_clusters: this.state.num_clusters - 1 }, () => {
        if (this.props.onChange) {
          this.props.onChange(this.state);
        }
      });
    }
  };
  IncrementItem = () => {
    this.setState({ num_clusters: this.state.num_clusters + 1 }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "40%",
          justifyContent: "space-between",
          marginBottom: "5%",
          height: "50px",
          paddingTop: "10px",
        }}
      >
        <div>
          <label>
            <h5> Cluster data </h5>
          </label>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "30px",
        }}>
          Num clusters: <Button variant="contained" size="small" onClick={this.DecreaseItem}>-</Button>
          <p>{this.state.num_clusters}</p>
          <Button variant="contained" size="large" onClick={this.IncrementItem}> + </Button>
        </div>        
      </div>
    );
  }
}

export default Incrementor;
