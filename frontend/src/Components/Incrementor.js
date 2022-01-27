import React, { Component } from "react";
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
            <h5> Clustering the data </h5>
          </label>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "30px",
        }}>
          Num clusters: <button onClick={this.DecreaseItem}>-</button>
          <p>{this.state.num_clusters}</p>
          <button onClick={this.IncrementItem}> + </button>
        </div>        
      </div>
    );
  }
}

export default Incrementor;
