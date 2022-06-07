import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Button, Checkbox } from "@material-ui/core";
import PropTypes from "prop-types";

class AdmixOptions extends Component {
  state = {
    initialAlpha: this.props.initialAlpha,
    initialCertainty: this.props.initialCertainty,
    checked: true,
  };

  componentDidMount = () => {
    this.setState({ initialVal: this.props.initialVal });
  };
  rangeSelectorAlpha = (event, newValue) => {
    this.setState({ initialAlpha: newValue });
  };
  rangeSelectorCertainty = (event, newValue) => {
    this.setState({ initialCertainty: newValue });
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
          <h6 style={{ fontWeight: "bold" }}>Alpha: </h6>
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Slider
            value={this.state.initialAlpha}
            onChange={this.rangeSelectorAlpha}
            valueLabelDisplay="auto"
            min={1}
            max={100}
          />

          <Button
            onClick={(event) => {
              this.props.parentCallback(this.state);
              event.preventDefault();
            }}
            variant="outlined"
            style={{ marginLeft: "10px" }}
            disabled={this.props.disabled}
          >
            Apply
          </Button>
        </div>
        Chosen Alpha: {this.state.initialAlpha} %
        <Typography id="range-slider" gutterBottom>
          <h6 style={{ marginTop: "10%", fontWeight: "bold" }}>Certainty: </h6>
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Slider
            value={this.state.initialCertainty}
            onChange={this.rangeSelectorCertainty}
            valueLabelDisplay="auto"
            min={1}
            max={100}
          />

          <Button
            onClick={(event) => {
              this.props.parentCallback(this.state);
              event.preventDefault();
            }}
            variant="outlined"
            style={{ marginLeft: "10px" }}
            disabled={this.props.disabled}
          >
            Apply
          </Button>
        </div>
        Chosen Certainty: {this.state.initialCertainty} %
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
