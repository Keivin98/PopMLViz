import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import { AiFillCaretDown } from 'react-icons/ai';
import PCAir from './PCAir';
import { VscTypeHierarchy } from 'react-icons/vsc';

class UploadAndVisualizeTab extends Component {
	state = {
		selectedUploadOption: null,
		selectedFile: null,
		open: false,
	};
	setOpen = (open) => {
		this.setState({ open: open });
	};
	onUploadValueChange = (event) => {
		this.setState(
			{
				selectedUploadOption: event.target.value,
			},
			() => {
				if (this.props.onChange) {
					this.props.onChange(this.state);
				}
			}
		);
	};
	render() {
		return (
			<div>
				<div
					style={{
						marginBottom: '5%',
						justifyContent: 'space-between',
						display: 'flex',
						flexDirection: 'row',
					}}
					onClick={() => this.setOpen(!this.state.open)}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							width: '90%',
						}}
					>
						<VscTypeHierarchy
							size={30}
							style={{
								marginRight: '3%',
								transform: 'rotate(180deg)',
								opacity: 0.5,
							}}
						/>
						<label>Dimensionality Reduction</label>
					</div>
					<AiFillCaretDown style={{ marginTop: '3%' }} />
				</div>
				<Collapse in={this.state.open}>
					<div id="example-collapse-text">
						<div className="radio">
							<input
								type="radio"
								value="Correlation Matrix"
								checked={
									this.state.selectedUploadOption === 'Correlation Matrix'
								}
								onChange={this.onUploadValueChange}
							/>
							<label style={{ paddingLeft: '10px' }}>PCA</label>
						</div>
						<div className="radio">
							<input
								type="radio"
								value="PC-AiR"
								checked={this.state.selectedUploadOption === 'PC-AiR'}
								onChange={this.onUploadValueChange}
							/>
							<label style={{ paddingLeft: '10px' }}> PC-AiR</label>
						</div>
						<div>
							<input
								type="radio"
								value="t-SNE 2D"
								checked={this.state.selectedUploadOption === 't-SNE 2D'}
								onChange={this.onUploadValueChange}
							/>
							<label style={{ paddingLeft: '10px' }}> t-SNE 2D</label>
						</div>
						<div>
							<input
								type="radio"
								value="t-SNE 3D"
								checked={this.state.selectedUploadOption === 't-SNE 3D'}
								onChange={this.onUploadValueChange}
							/>
							<label style={{ paddingLeft: '10px' }}> t-SNE 3D</label>
						</div>

						<div>
							{this.state.selectedUploadOption === 'Correlation Matrix' && (
								<div
									style={{
										width: '300px',
										paddingTop: '20px',
										paddingBottom: '20px',
									}}
								>
									<label style={{ fontStyle: 'italic' }}>
										expected: Correlation Matrix.
									</label>
								</div>
							)}
							{(this.state.selectedUploadOption === 't-SNE 2D' ||
								this.state.selectedUploadOption === 't-SNE 3D') && (
								<div
									style={{
										width: '300px',
										paddingTop: '20px',
										paddingBottom: '20px',
									}}
								>
									<label style={{ fontStyle: 'italic' }}>
										expected: PCA Data.
									</label>
								</div>
							)}

							{this.state.selectedUploadOption === 'PC-AiR' && (
								<div>
									<PCAir />
									<Button
										variant="outlined"
										style={{
											color: '#1891fb',
											fontWeight: 'bold',
											height: '2%',
											backgroundColor: '#ebeff7',
										}}
										onClick={this.props.runPCAir}
									>
										Run PC-AiR
									</Button>
								</div>
							)}
						</div>
					</div>
				</Collapse>
			</div>
		);
	}
}
UploadAndVisualizeTab.propTypes = {
	runPCAir: PropTypes.func,
};

export default UploadAndVisualizeTab;
