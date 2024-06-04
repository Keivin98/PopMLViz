import React, { useState } from "react";

const Incrementor = ({ onChange }) => {
  const [numClusters, setNumClusters] = useState(2);

  const handleChange = (event) => {
    const value = Number(event.target.value);
    if (value >= 2) {
      setNumClusters(value);
      if (onChange) {
        onChange({ num_clusters: value });
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginLeft: "15%",
        marginTop: "5%",
      }}
    >
      <div>Clusters: </div>
      <input
        type="number"
        name="clicks"
        style={{ width: "25%", height: "75%", marginLeft: "5%"}}
        value={numClusters.toString()}
        onChange={handleChange}
      />
    </div>
  );
};

export default Incrementor;
