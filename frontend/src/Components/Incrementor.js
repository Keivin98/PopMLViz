import React, { Component } from "react";

class Incrementor extends Component {
  state = {
    num_clusters: 2,
  };
  handleChange = (event) => {
    if (Number(event.target.value) >= 2) {
      this.setState({ num_clusters: Number(event.target.value) }, () => {
        if (this.props.onChange) {
          this.props.onChange(this.state);
        }
      });
    }
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          marginLeft: "15%",
          marginTop: "5%",
        }}
      >
        Clusters:{" "}
        <input
          type="number"
          name="clicks"
          style={{ width: "100%", height: "75%", marginLeft: "5%" }}
          value={Number(this.state.num_clusters).toString()}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default Incrementor;
