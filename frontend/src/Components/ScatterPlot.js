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
      <div
        style={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Plot
          data={this.props.data}
          style={styles.scatterContainer}
          layout={this.props.layout}
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
    height: '75%',
    position: 'fixed',
    z_index: 1,
    top: 0,
    overflow_x: 'hidden',
    padding_top: '20px',
    left: 0,
    width: '55%',
    marginTop: '7%',
    marginLeft: '26%',
  },
};
export default ScatterPlot;
