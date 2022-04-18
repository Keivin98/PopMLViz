import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

const randomColors = [
	'#3f91ba',
	'#801f65',
	'#86af43',
	'#d73521',
	'#1d4c91',
	'#2c663b',
	'#cc9d3f',
	'#ff7ae6',
	'#d87368',
	'#99f7a2',
	'#a3a6ed',
	'#0740ba',
	'#277f05',
];
class BarPlot extends Component {
	range = (start, end) => {
		/* generate a range : [start, start+1, ..., end-1, end] */
		var len = end - start + 1;
		var a = new Array(len);
		for (let i = 0; i < len; i++) a[i] = start + i;
		return a;
	};
	assignClusterToRow = (row) => {
		// returns index of maximum value
		// unless max and second max are less than 0.2 apart
		var parsedRow = Object.values(row).map((a) => {
			return parseFloat(a);
		});
		const rowDescending = [...parsedRow].sort((a, b) => b - a);
		if (rowDescending[0] - rowDescending[1] < 0.2) {
			return parsedRow.length;
		} else {
			return parsedRow.indexOf(rowDescending[0]);
		}
	};

	BarPlotFromData = () => {
		var colors = [];
		var data_new = [];

		if (this.props.data !== [] && this.props.data != null) {
			const num_clusters = Object.keys(this.props.data[0]).length;

			for (let j = 0; j < num_clusters; j += 1) {
				colors.push(randomColors[j]);
			}

			let sortedValues = [...this.props.data].sort((a, b) => {
				return this.assignClusterToRow(a) > this.assignClusterToRow(b) ? 1 : -1;
			});

			for (let n = 1; n < num_clusters + 1; n += 1) {
				let y_values = sortedValues.map((x) => x['v' + n]);

				data_new.push({
					type: 'bar',
					name: n,
					x: this.range(0, y_values.length),
					y: y_values,
				});
			}
		}

		return (
			<Plot
				data={data_new}
				layout={{ title: 'ADMIXTURE', barmode: 'stack' }}
				style={styles.barContainer}
			/>
		);
	};

	render() {
		return <div>{this.BarPlotFromData()}</div>;
	}
}

BarPlot.propTypes = {
	data: PropTypes.array,
};

const styles = {
	barContainer: {
		position: 'fixed',
		z_index: 1,
		top: 0,
		overflow_x: 'hidden',
		left: 0,
		marginTop: '13%',
		marginLeft: '26%',
		width: '52%',
		height: '73%',
	},
};
export default BarPlot;
