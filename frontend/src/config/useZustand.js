import { create } from 'zustand'

const useZustand = create((set) => ({
    numClusters: 2,
    setNumClusters: (numClusters) => set({ numClusters }),
    selectedClusterMethod: null,
    setSelectedClusterMethod: (selectedClusterMethod) => set({ selectedClusterMethod }),
}))

export default useZustand;