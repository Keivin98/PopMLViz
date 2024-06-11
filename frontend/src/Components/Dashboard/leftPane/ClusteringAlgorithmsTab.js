import React, { useState } from "react";
import Select from "react-select";
import Collapse from "react-bootstrap/Collapse";
import { AiFillCaretDown } from "react-icons/ai";
import Incrementor from "./Incrementor";
import { Button } from "@material-ui/core";
import { AiOutlineCluster } from "react-icons/ai";
import font from "../../../config/font";

const ClusteringAlgorithmsTab = ({ onChange }) => {
  const [selectClusterActions] = useState([
    {
      label: "K-means",
      value: 0,
    },
    {
      label: "Hierarchical clustering",
      value: 1,
    },
    {
      label: "Fuzzy c-means",
      value: 2,
    },
  ]);
  const [numClusters, setNumClusters] = useState(2);
  const [selectedClusterMethod, setSelectedClusterMethod] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClusterChange = (option) => {
    setSelectedClusterMethod(option.value);
  };

  const runCluster = () => {
    onChange({ selectedClusterMethod, num_clusters: numClusters });
  };

  const incrementHandler = (data) => {
    setNumClusters(data.num_clusters);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "5%",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
        }}
        onClick={() => setOpen(!open)}
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

      <Collapse in={open}>
        <div id="example-collapse-text">
          <div style={{ display: "flex", flexDirection: "column", }}>
            <div style={{  display: "flex", flexDirection: 'row' , justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{marginRight: "5%",}}>Algorithm: </div>
              <Select
                options={selectClusterActions}
                defaultValue={selectClusterActions.find(
                  (x) => x.value === selectedClusterMethod
                )}
                styles={{
                  
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                   
                  }),
                }}
                onChange={handleClusterChange}
              />
            </div>

            <div style={{ }}>
              <Incrementor onChange={incrementHandler} />
            </div>
          </div>

          <div>
            <Button
              variant="outlined"
              onClick={runCluster}
              style={{
                color: "#ebeff7",
                fontWeight: "bold",
                backgroundColor:
                  selectedClusterMethod == null ? "grey" : "#1891fb",
                marginTop: "5%",
                fontFamily: font.primaryFont,
                marginLeft: "40%",
              }}
              disabled={selectedClusterMethod == null}
            >
              Run
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default ClusteringAlgorithmsTab;
