import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Button } from "@material-ui/core";

class OutlierBlock extends Component {
  state = {
    columnRange: [1,10],
  };

  rangeSelector = (event, newValue) => {
    this.setState({columnRange: newValue})
  };
  handleApplyClick = () => {
    this.props.onChange(this.state);
  }
  
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "space-between",
          marginBottom: "5%",
          height: "50px",
          paddingTop: "10px",
        }}
      >
        <Typography id="range-slider" gutterBottom>
              Columns:
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
              min={1}
              max={20}
            />
            <Button 
                onClick={this.handleApplyClick} 
                variant="outlined" 
                style={{ marginLeft: "10px" }}
            > 
                Apply
            </Button>
        </div>
        PC{this.state.columnRange[0]} to PC{this.state.columnRange[1]}
      </div>
    );
  }
}

export default OutlierBlock;