import ProgressBar from "@ramonak/react-progress-bar";
import React, { Component } from 'react';
import Loader from "react-loader-spinner";

import PropTypes from 'prop-types';

class ProgressBarTime extends Component {
    state = {
        completed : 10,
        interval: 0
    }
    componentDidMount() {
        var interval = setInterval(() => {
            var timeInterval = this.props.totalTime ? this.props.totalTime : 5;
            if (this.state.completed + 89.0/timeInterval > 99){
                this.setState({completed : 99});
                clearInterval(this.state.interval);
            }else{
                
                this.setState({ completed:  this.state.completed + Math.round(89.0/timeInterval)});
                }
        }, 500);
        this.setState({interval: interval});
        console.log(interval)
      }

    render() {
        return (
        <div style = {styles.ProgressBar}>
            { this.props.type === 'Loader' && 
            (<Loader type="TailSpin" color="#00BFFF" height="100" width="100" style = {{marginLeft:'40%'}}/>) }

            { this.props.type === 'ProgressBar' && 
            (<ProgressBar 
                completed={this.state.completed} 
                maxCompleted={100} 
                bgColor='white'
                labelColor='#3287bf'
                baseBgColor='#ebeff7'
            />  ) }
            
        </div>
        );
  }
}

ProgressBarTime.propTypes = {
    totalTime: PropTypes.number,
    type: PropTypes.string,
  };

const styles = {
    ProgressBar: {
        width: "50%",
        marginRight: '25%'
    },
};
export default ProgressBarTime;
