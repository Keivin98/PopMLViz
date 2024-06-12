import React, { useState } from "react";
import InputOptions from "../../InputOptions";

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
    <>
      <InputOptions label={"Clusters"}>
        <input
          type="number"
          name="clicks"
          style={{ width: 50, height: "75%", marginLeft: "5%" }}
          value={numClusters.toString()}
          onChange={handleChange}
        />
      </InputOptions>
    </>
  );
};

export default Incrementor;
