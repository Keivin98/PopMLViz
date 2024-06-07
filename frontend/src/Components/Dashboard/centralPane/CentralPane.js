import React from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import BarPlot from './BarPlot';
import Dendrogram from './Dendrogram';
import 'react-tabs/style/react-tabs.css';

const CentralPane = ({
  showScatterPlot,
  dendrogramPath,
  admix,
  selectedUploadOption,
  alphaVal,
  certaintyVal,
  clusterNames,
  clusterNumberChange,
  admixOptionsLabelCheck,
  plotTitle,
  picWidth,
  picHeight,
  picFormat,
  admixMode
}) => (
  <div style={{}}>
    <Tabs style={styles.dendrogramTabs}>
      <TabList>
        <Tab>Scatter Plot</Tab>
        {dendrogramPath !== "" && <Tab>Dendrogram</Tab>}
        {admix.length > 0 && selectedUploadOption === "pcairandadmixture" && <Tab>Admixture</Tab>}
      </TabList>
      <TabPanel>{showScatterPlot()}</TabPanel>
      {dendrogramPath !== "" && (
        <TabPanel>
          <Dendrogram dendrogramPath={dendrogramPath} />
        </TabPanel>
      )}
      <TabPanel>
        <BarPlot
          data={admix}
          alphaVal={alphaVal}
          certaintyVal={certaintyVal}
          clusterNames={{ ...clusterNames }}
          onChange={clusterNumberChange}
          AdmixOptionsLabelCheck={admixOptionsLabelCheck}
          plotTitle={plotTitle}
          picWidth={Number(picWidth)}
          picHeight={Number(picHeight)}
          picFormat={picFormat}
          admixMode={admixMode}
        />
      </TabPanel>
    </Tabs>
  </div>
);

const styles = {
  dendrogramTabs: {
    position: "fixed",
    top: 0,
    left: 0,
    marginTop: "10%",
    marginLeft: "21%",
    width: "52%",
  },
};

export default CentralPane;
