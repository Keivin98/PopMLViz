import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

class ScatterPlot extends Component {
  constructor() {
    super();
    this.state = {
      num_clusters: 0,
      clusterColors: [],
    };
  }

  render() {
    return (
      <div >
        <Plot
          data={this.props.data}
          layout={this.props.layout}
          style={styles.scatterContainer}
        />
      </div>
    );
  }
}
ScatterPlot.propTypes = {
  data: PropTypes.array,
  layout: PropTypes.object,
};
const styles = {
  scatterContainer: {
    position: 'fixed',
    z_index: 1,
    top: 0,
    overflow_x: 'hidden',
    left: 0,
    marginTop: '12%',
    marginLeft: '26%',
    width: "52%",
    height: "73%"
  },
};
export default ScatterPlot;
