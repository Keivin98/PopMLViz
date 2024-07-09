import React, { useState } from "react";
import Select from "react-select";
import Collapse from "react-bootstrap/Collapse";
import { AiFillCaretDown } from "react-icons/ai";
import Incrementor from "./Incrementor";
import { Button } from "@material-ui/core";
import { AiOutlineCluster } from "react-icons/ai";
import font from "../../../config/font";
import InputOptions from "../../InputOptions";
import AppButton from "../../AppButton";
import colors from "../../../config/colors";
import "../../DropDown.css" 
import useZustand from "../../../config/useZustand";

const ClusteringAlgorithmsTab = ({ onChange }) => {

  const {confirmedClusterMethod, setConfirmedClusterMethod} = useZustand();
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 100,
    }),
  };

  const handleClusterChange = (option) => {
    setSelectedClusterMethod(option.value);
  };

  const runCluster = () => {
    setConfirmedClusterMethod(selectedClusterMethod)
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
          <AiOutlineCluster size={30} style={{ marginRight: "3%", opacity: 0.5 }} />
          <label className="label-txt">Clustering Algorithms</label>
        </div>

        <AiFillCaretDown style={{ marginTop: "3%" }} />
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <InputOptions label={"Algorithm"}>
              <Select
                options={selectClusterActions}
                defaultValue={selectClusterActions.find((x) => x.value === selectedClusterMethod)}
                styles={{
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                  control: (provided) => ({
                    ...provided,
                    // width: 100,
                  }),
                }}
                onChange={handleClusterChange}
              />
            </InputOptions>

            <div style={{}}>
              <Incrementor onChange={incrementHandler} />
            </div>
          </div>

          <div style={{display: "flex", alignItems: 'center', justifyContent: 'center'}}>
            <Button
              variant="outlined"
              onClick={runCluster}
              style={{
                color: "#ebeff7",
                fontWeight: "bold",
                backgroundColor: selectedClusterMethod == null ? "grey" : colors.blue,
                marginTop: 20,
                fontFamily: font.primaryFont,
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
