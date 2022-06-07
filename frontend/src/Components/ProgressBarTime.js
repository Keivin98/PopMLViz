import ProgressBar from "@ramonak/react-progress-bar";
import React, { Component } from "react";
import Loader from "react-loader-spinner";

import PropTypes from "prop-types";
var texts = [
  "Please wait for the files to load ",
  "Files Uploaded ",
  "Computation Started ",
  "Computation in progress. Please do no not click anywhere else ",
  "Preparing your results ",
  "Won't take much longer ",
  "Won't take much longer ",
  "Won't take much longer ",
  "Results are on the way ",
  "Results are on the way ",
  "Results are on the way ",
  "Final touch ",
  "Final touch ",
  "Final touch ",
  "Final touch ",
];
class ProgressBarTime extends Component {
  state = {
    completed: 10,
    interval: 0,
    position: 0,
    dots: "..",
  };
  increaseDots = () => {
    if (this.state.dots.length == 1) {
      this.setState({ dots: ".." });
    } else if (this.state.dots.length == 2) {
      this.setState({ dots: "..." });
    } else {
      this.setState({ dots: "." });
    }
  };
  componentDidMount() {
    var interval = setInterval(() => {
      var timeInterval = this.props.totalTime ? this.props.totalTime / 2 : 5;
      this.increaseDots();
      if (this.state.completed + 89.0 / timeInterval > 99) {
        this.setState({
          text:
            this.state.position <= 9
              ? texts[this.state.position + 5] + this.state.dots
              : "Finalizing " + this.state.dots,
          position: this.state.position + 1,
          completed: 99,
        });
      } else {
        let position = 0;
        if (this.state.completed < 25) {
          position = 0;
        } else if (this.state.completed < 30) {
          position = 1;
        } else if (this.state.completed < 35) {
          position = 2;
        } else if (this.state.completed < 70) {
          position = 3;
        } else {
          position = 3;
        }
        var newCompleted =
          this.state.completed +
          Math.round((50 / timeInterval) * 5 * Math.random());
        this.setState({
          text: texts[position] + this.state.dots,
          completed: newCompleted < 99 ? newCompleted : 99.5,
          interval: interval,
        });
      }
    }, 1000 + 1000 * this.state.position);
  }
  componentDidUpdate(prevProps) {
    if (!this.props.isLoading || !prevProps.isLoading) {
      clearInterval(this.state.interval);
    }
  }
  render() {
    return (
      <div key={this.props.isLoading} style={styles.ProgressBar}>
        {this.props.type === "Loader" && (
          <Loader
            type="TailSpin"
            color="#00BFFF"
            height="100"
            width="100"
            style={{ marginLeft: "40%" }}
          />
        )}
        {this.props.type === "ProgressBar" && (
          <div>
            <h5 style={{ color: "#3287bf" }}>{this.state.text}</h5>
            <ProgressBar
              completed={this.state.completed}
              maxCompleted={100}
              bgColor="#3287bf"
              labelColor="white"
              baseBgColor="white"
            />{" "}
          </div>
        )}
      </div>
    );
  }
}

ProgressBarTime.propTypes = {
  totalTime: PropTypes.number,
  type: PropTypes.string,
  isLoading: PropTypes.bool,
};

const styles = {
  ProgressBar: {
    width: "50%",
    marginRight: "25%",
  },
};
export default ProgressBarTime;
