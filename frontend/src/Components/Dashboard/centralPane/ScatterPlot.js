import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as Plotly from "plotly.js";

const ScatterPlot = ({ data, layout, picWidth, picHeight, picFormat, plotTitle }) => {
  const scatterRef = useRef(null);

  const showPlot = () => {
    const updatedLayout = {
      ...layout,
      margin: {
        l: 40,
        r: 40,
        t: 40,
        b: 40,
      },
      autosize: true,
    };

    Plotly.newPlot(scatterRef.current, data, updatedLayout, {
      toImageButtonOptions: {
        filename: plotTitle,
        width: picWidth,
        height: picHeight,
        format: picFormat,
      },
    });
  };

  const handleResize = () => {
    if (scatterRef.current) {
      Plotly.Plots.resize(scatterRef.current);
    }
  };

  useEffect(() => {
    showPlot();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, layout, picWidth, picHeight, plotTitle]);

  const scatterContainerStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const plotContainerStyle = {
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
  };

  return (
    <div style={scatterContainerStyle}>
      <div ref={scatterRef} style={plotContainerStyle}></div>
    </div>
  );
};

ScatterPlot.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
  picWidth: PropTypes.number,
  picHeight: PropTypes.number,
  picFormat: PropTypes.string,
  plotTitle: PropTypes.string,
};

export default ScatterPlot;
