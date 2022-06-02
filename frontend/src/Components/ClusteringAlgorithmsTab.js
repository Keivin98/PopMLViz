import React, { Component } from "react";
import Select from "react-select";
import Collapse from "react-bootstrap/Collapse";
import { AiFillCaretDown } from "react-icons/ai";
import Incrementor from "./Incrementor";
import { Button } from "@material-ui/core";
import { AiOutlineCluster } from "react-icons/ai";
class ClusteringAlgorithmsTab extends Component {
  state = {
    selectClusterActions: [
      {
        label: "K-means",
        value: 0,
      },
			{
				label: 'Hierarchical clustering',
				value: 1,
			},      
      {
        label: "Fuzzy c-means",
        value: 2,
      },
    ],
    num_clusters: 2,
    selectedClusterMethod: null,
    open: false,
  };
  setOpen = (open) => {
    this.setState({ open: open });
  };
  handleClusterChange = (option) => {
    this.setState({ selectedClusterMethod: option.value });
  };
  runCluster = () => {
    this.props.onChange(this.state);
  };
  IncrementHandler = (data) => {
    this.setState({ num_clusters: data.num_clusters });
  };
  render() {
    return (
      <div>
        <div
          style={{
            marginBottom: "5%",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
          onClick={() => this.setOpen(!this.state.open)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "80%",
            }}
          >
            <AiOutlineCluster
              size={30}
              style={{ marginRight: "3%", opacity: 0.5 }}
            />
            <label>Clustering Algorithms</label>
          </div>

          <AiFillCaretDown style={{ marginTop: "3%" }} />
        </div>

        <Collapse in={this.state.open}>
          <div id="example-collapse-text">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ width: "50%" }}>
                <Select
                  options={this.state.selectClusterActions}
                  defaultValue={
                    this.state.selectClusterActions.filter((x) => {
                      return x.value === this.state.selectedClusterMethod;
                    })[0]
                  }
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      color: "black",
                    }),
                  }}
                  onChange={this.handleClusterChange}
                />
              </div>

              <div style={{ width: "50%" }}>
                <Incrementor onChange={this.IncrementHandler} />
              </div>
            </div>

            <div>
              <Button
                variant="outlined"
                onClick={this.runCluster}
                style={{
                  color: "#ebeff7",
                  fontWeight: "bold",
                  backgroundColor:
                    this.state.selectedClusterMethod == null
                      ? "grey"
                      : "#1891fb",
                  marginTop: "5%",
                  marginLeft: "40%",
                }}
                disabled={this.state.selectedClusterMethod == null}
              >
                Run
              </Button>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default ClusteringAlgorithmsTab;
