import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

class AdmixOptions extends Component {
  state = {
    columnRange: this.props.columnRange,
  };

  rangeSelector = (event, newValue) => {
    this.setState({ columnRange: newValue });
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "space-between",
          marginTop: "10%",
          marginBottom: "5%",
          height: "50px",
          paddingTop: "10px",
        }}
      >
        <Typography id="range-slider" gutterBottom>
          <h6>Alpha: </h6>
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Slider
            value={this.state.columnRange}
            onChange={this.rangeSelector}
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
          <Button
            onClick={(event) => {
              this.props.parentCallback(this.state.columnRange);
              event.preventDefault();
            }}
            variant="outlined"
            style={{ marginLeft: "10px" }}
          >
            Apply
          </Button>
        </div>
        Chosen alpha: {this.state.columnRange} %
      </div>
    );
  }
}
AdmixOptions.propTypes = {
  columnRange: PropTypes.number,
};
export default AdmixOptions;
