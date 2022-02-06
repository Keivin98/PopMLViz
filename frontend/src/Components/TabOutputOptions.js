import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";

class TabOutputOptions extends Component {

  state = {
      cluster_names: {
      }
  }
  showOutputOptions = () => {
    var num_clusters = this.props.uniqueClusters;
    if (num_clusters < 2){
        num_clusters = 2;
    }
    return (
      <div>
        Change cluster names:
        {[...Array(num_clusters)].map((clusterName, index) => {
          return (
            <div>
              Cluster {index}
              <input type="text" name={index} style={{marginLeft: "20px"}} onChange={(e) => {
                  var new_cluster_names = this.state.cluster_names;
                  new_cluster_names[index] = e.target.value; 
                  this.setState({cluster_names: new_cluster_names});
              }}/>
            </div>
          )
        })}
      </div>
    )
  }
  render() {
    return (
      <div>     
          {this.showOutputOptions()}
          <Button variant="outlined" onClick={(event) => {
              this.props.parentCallback(this.state.cluster_names);
              event.preventDefault();
            }
          }> 
            Submit 
          </Button>
      </div>
    );
  }
}

TabOutputOptions.propTypes = {
    uniqueClusters: PropTypes.array,
  };

export default TabOutputOptions;
