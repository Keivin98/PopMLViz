import React from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import BarPlot from './BarPlot';
import Dendrogram from './Dendrogram';
import "../dashboard.css";

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
  admixMode,
  clusterColors
}) => (
  <div className='grid-c'>
    <Tabs style={styles.dendrogramTabs}>
      <TabList style={{marginBottom: 3}}>
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
          clusterColors={clusterColors}
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
    // height: 1000,
  },
};

export default CentralPane;
