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
        {/* <div style={{ marginTop: '500%', flexDirection: 'row' }}>
          <div className="radio">
            <label>
              <input
                type="radio"
                value="Correlation Matrix"
                checked={
                  this.state.selectedUploadOption === 'Correlation Matrix'
                }
                onChange={this.onUploadValueChange}
              />
              Correlation Matrix
            </label>
          </div>
          <div className="radio">
            <label>
              <input
                type="radio"
                value="PCA"
                checked={this.state.selectedUploadOption === 'PCA'}
                onChange={this.onUploadValueChange}
              />
              PCA
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                value="t-SNE"
                checked={this.state.selectedUploadOption === 't-SNE'}
                onChange={this.onUploadValueChange}
              />
              t-SNE
            </label>
          </div>
        </div> */}
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
    backgroud_color: 'red',
    width: '55%',
    marginTop: '7%',
    marginLeft: '26%',
  },
};
export default ScatterPlot;
