import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from "react-loader-spinner";

class PCAir extends Component {
    state = {
        loading: false
    }
  handleFileUpload = (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', ev.target.files[0]);
    data.append('filename', ev.target.value);
    this.setState({
        loading:true,
    })

    fetch('http://10.4.4.115:5000/uploadPCAIR', {
      method: 'POST',
      body: data,
    }).then((response) => {
        this.setState({
            loading:false,
        })
    });
  }
  render() {
    return (
    <div
        style={styles.pcair}
    >
        <label>Upload necessary files for PCAir</label>
        <div style={styles.uploads}> 
            <label style={{marginRight:'6%'}}>.bed</label>
            <input
              type="file"
              accept=".bed"
              onChange={this.handleFileUpload}
            />
        </div>
        <div style={styles.uploads}> 
            <label style={{marginRight:'6%'}}>.bim</label>
            <input
              type="file"
              accept=".bim"
              onChange={this.handleFileUpload}
            />
        </div>
        <div style={styles.uploads}> 
            <label style={{marginRight:'6%'}}>.fam</label>
            <input
              type="file"
              accept=".fam"
              onChange={this.handleFileUpload}
            />
        </div>
        <div style={styles.uploads}> 
            <label style={{marginRight:'3%'}}>Kinship</label>
            <input
              type="file"
              accept=".txt"
              onChange={this.handleFileUpload}
            />
        </div>
        {this.state.loading && <Loader type="TailSpin" color="#00BFFF" height="30" width="30" style={{marginTop:'2%', marginLeft: '20%'}}/>}
    </div>
    );
  }
}

const styles = {
    pcair: {
        paddingTop: "20px",
        paddingBottom: "20px",
      },
    uploads: {
        display: 'flex', 
        flexDirection: 'row',
        padding: '2px'
    }

};
export default PCAir;
