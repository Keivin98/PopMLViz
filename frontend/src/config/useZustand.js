import { create } from 'zustand'

const useZustand = create((set) => ({
    numClusters: 2,
    setNumClusters: (numClusters) => set({ numClusters }),
    confirmedClusterMethod: null,
    setConfirmedClusterMethod: (confirmedClusterMethod) => set({ confirmedClusterMethod }),
    outlierDetectionOptions: {},
    setOutlierDetectionOptions: (outlierDetectionOptions) => set({ outlierDetectionOptions }),
}))

export default useZustand;