from sklearn.cluster import KMeans

def runKmeans(pca_df):
    kmeans = KMeans(n_clusters=4, random_state=0).fit_predict(pca_df)
    
    return kmeans