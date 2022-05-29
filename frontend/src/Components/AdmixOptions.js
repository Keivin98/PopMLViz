import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

class AdmixOptions extends Component {
  state = {
    initialVal: 0,
  };

  componentDidMount = () => {
    this.setState({ initialVal: this.props.initialVal });
  };
  rangeSelector = (event, newValue) => {
    this.setState({ initialVal: newValue });
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
          <h6>{this.props.name}: </h6>
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Slider
            value={this.state.initialVal}
            onChange={this.rangeSelector}
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
          <Button
            onClick={(event) => {
              this.props.parentCallback(this.state.initialVal);
              event.preventDefault();
            }}
            variant="outlined"
            style={{ marginLeft: "10px" }}
            disabled={this.props.disabled}
          >
            Apply
          </Button>
        </div>
        Chosen {this.props.name}: {this.state.initialVal} %
        <label style={{ marginTop: "10%", fontStyle: "italic" }}>
          {this.props.description}{" "}
        </label>
      </div>
    );
  }
}
AdmixOptions.propTypes = {
  initialVal: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.bool,
};
export default AdmixOptions;
