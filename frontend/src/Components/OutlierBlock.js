import React, { Component } from "react";
import Slider from "@material-ui/core/Slider";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

class OutlierBlock extends Component {
  state = {
    columnRange: this.props.columnRange,
  };

  rangeSelector = (event, newValue) => {
    this.setState({ columnRange: newValue });
  };
  handleApplyClick = () => {
    this.props.onChange(this.state);
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "space-between",
          marginBottom: "10%",
          height: "50px",
          paddingTop: "10px",
        }}
      >
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
            min={1}
            max={20}
            marks
            style={{ color: "#1891fb" }}
          />
          <Button
            onClick={this.handleApplyClick}
            variant="outlined"
            style={{
              fontWeight: "bold",
              marginLeft: "10%",
              backgroundColor: "#ebeff7",
              color: "#1891fb",
            }}
          >
            Apply
          </Button>
        </div>
        Columns: PC{this.state.columnRange[0]} to PC{this.state.columnRange[1]}
      </div>
    );
  }
}
OutlierBlock.propTypes = {
  columnRange: PropTypes.array,
};
export default OutlierBlock;
