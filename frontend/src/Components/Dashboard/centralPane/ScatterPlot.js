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
      responsive: true,
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

  return <div ref={scatterRef} style={{height: 'calc(100vh - 180px )' }}></div>;
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
