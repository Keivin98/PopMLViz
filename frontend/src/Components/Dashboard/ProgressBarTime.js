import ProgressBar from "@ramonak/react-progress-bar";
import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";
import colors from "../../config/colors";

const texts = [
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

const ProgressBarTime = ({ totalTime, type, isLoading }) => {
  const [completed, setCompleted] = useState(10);
  const [position, setPosition] = useState(0);
  const [dots, setDots] = useState("..");
  const [intervalId, setIntervalId] = useState(null);
  const [text, setText] = useState(texts[0]);

  const increaseDots = () => {
    setDots((prevDots) => (prevDots.length === 1 ? ".." : prevDots.length === 2 ? "..." : "."));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const timeInterval = totalTime ? totalTime / 2 : 5;
      increaseDots();

      if (completed + 89.0 / timeInterval > 99) {
        setText(position <= 9 ? texts[position + 5] + dots : "Finalizing " + dots);
        setPosition((prevPosition) => prevPosition + 1);
        setCompleted(99);
      } else {
        let newPosition = 0;
        if (completed < 25) newPosition = 0;
        else if (completed < 30) newPosition = 1;
        else if (completed < 35) newPosition = 2;
        else if (completed < 70) newPosition = 3;
        else newPosition = 3;

        const newCompleted = completed + Math.round((50 / timeInterval) * 5 * Math.random());
        setText(texts[newPosition] + dots);
        setCompleted(newCompleted < 99 ? newCompleted : 99.5);
        setPosition(newPosition);
      }
    }, 1000 + 1000 * position);

    setIntervalId(interval);

    return () => clearInterval(interval);
  }, [completed, position, dots, totalTime]);

  useEffect(() => {
    if (!isLoading) {
      clearInterval(intervalId);
    }
  }, [isLoading, intervalId]);

  return type === "Loader" ? (
    <div key={isLoading} style={styles.loader}>
      <Loader type="TailSpin" color={colors.secondary} height="100" width="100" />
    </div>
  ) : (
    <div key={isLoading} style={styles.ProgressBar}>
      <h5 style={{ color: "#3287bf" }}>{text}</h5>
      <ProgressBar completed={completed} maxCompleted={100} bgColor="#3287bf" labelColor="white" baseBgColor="white" />
    </div>
  );
};

ProgressBarTime.propTypes = {
  totalTime: PropTypes.number,
  type: PropTypes.string,
  isLoading: PropTypes.bool,
};

const styles = {
  loader: {
    // width: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  ProgressBar: {
    width: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    top: "50%",
    left: "50%",
  },
};

export default ProgressBarTime;
