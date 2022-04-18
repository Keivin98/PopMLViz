import React, { Component } from 'react';
import { Button } from '@material-ui/core';

class Incrementor extends Component {
	state = {
		num_clusters: 2,
	};
	handleChange = (event) => {
		if (Number(event.target.value) >= 2) {
			this.setState({ num_clusters: Number(event.target.value) });
		}
	};
	render() {
		return (
			<div
				style={{
					display: 'flex',
					width: '60%',
					// justifyContent: 'space-between',
				}}
			>
				Num clusters:{' '}
				<input
					type="number"
					name="clicks"
					style={{ width: '35%', height: '75%', marginLeft: '5%' }}
					value={Number(this.state.num_clusters).toString()}
					onChange={this.handleChange}
				/>
			</div>
		);
	}
}

export default Incrementor;
