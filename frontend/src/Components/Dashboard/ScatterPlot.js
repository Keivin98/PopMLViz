import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as Plotly from "plotly.js";

const ScatterPlot = ({ data, layout, picWidth, picHeight, picFormat, plotTitle }) => {
  const scatterRef = useRef(null);

  const showPlot = () => {
    return Plotly.newPlot(scatterRef.current, data, layout, {
      toImageButtonOptions: {
        filename: plotTitle,
        width: picWidth,
        height: picHeight,
        format: picFormat,
      },
    });
  };

  useEffect(() => {
    showPlot();
  }, [data, layout, picWidth, picHeight, picFormat, plotTitle]);

  return <div ref={scatterRef} style={styles.scatterContainer}></div>;
};

ScatterPlot.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
  picWidth: PropTypes.number,
  picHeight: PropTypes.number,
  picFormat: PropTypes.string,
  plotTitle: PropTypes.string,
};

const styles = {
  scatterContainer: {
    position: "fixed",
    zIndex: 1,
    top: 0,
    overflowX: "hidden",
    left: 0,
    marginTop: "13%",
    marginLeft: "21%",
    width: "57%",
    height: "74%",
  },
};

export default ScatterPlot;
