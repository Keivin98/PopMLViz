import './App.css';
import UploadFile from './Components/UploadFile';
import Navbar from 'react-bootstrap/Navbar';

function App() {
	return (
		<div>
			<Navbar
				style={{
					position: 'fixed',
					height: '7%',
					width: '100%',
					paddingLeft: '8%',
					backgroundColor: '#3b3f4e',
				}}
			>
				<Navbar.Brand style={{ color: 'white' }}>
					Data Visualization Tool
					<img
						src="./logo.jpeg"
						style={{ width: '5%', position: 'fixed', left: '2%', top: '2%' }}
					/>
				</Navbar.Brand>
			</Navbar>

			<UploadFile />
		</div>
	);
}

export default App;
