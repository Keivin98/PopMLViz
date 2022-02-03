from flask import jsonify,request
# from pandas.core.reshape.tile import cut
from app import create_app
import io
import pandas as pd
from sklearn.decomposition import PCA
import csv, random, string
import numpy as np
from common import runKmeans
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
# Create an application instance

app = create_app()
# Define a route to fetch the avaialable article

@app.route("/runkmeans", methods=["POST"], strict_slashes=False)
def runKmeans():
	request_filename = request.get_json()['filename']
	num_clusters = request.get_json()['num_clusters']
	input_path = './data/PCA/' + request_filename
	# print(input_path)
	pca_df = pd.read_csv(input_path)
	# print(pca_df)
	kmeans = KMeans(n_clusters=num_clusters, random_state=0).fit_predict(pca_df.iloc[:, 1:-2])
	# print(kmeans)
	return jsonify(list(map(lambda x : int(x), kmeans)))

@app.route("/cmtsne2d", methods=["POST"], strict_slashes=False)
def cmtsne2d():
	# print('tsne')
	request_filename = request.get_json()['filename']
	# kmeans = request.get_json()['runKmeans']
	input_path = './data/PCA/' + request_filename
	df = pd.read_csv(input_path)
	tsne_visualization = TSNE(random_state=123).fit_transform(df)
	letters = string.ascii_lowercase
	filename = ''.join(random.choice(letters) for i in range(5))
	completeRes = np.append([['TSNE%s'%(i) for i in range(1,3)]], tsne_visualization, axis = 0)
	np.savetxt('./data/tsne2d_%s.csv' % (filename), completeRes, delimiter=",", fmt='%s')
	with open('./data/tsne2d_%s.csv'% (filename), 'r') as f : 
		data = f.read()
	return 	data

@app.route("/cmtsne3d", methods=["POST"], strict_slashes=False)
def cmtsne3d():
	# print('tsne')
	request_filename = request.get_json()['filename']
	input_path = './data/PCA/' + request_filename
	df = pd.read_csv(input_path)
	tsne_visualization = TSNE(n_components=3, random_state=123).fit_transform(df)
	letters = string.ascii_lowercase
	filename = ''.join(random.choice(letters) for _ in range(5))
	completeRes = np.append([['TSNE%s'%(i) for i in range(1,4)]], tsne_visualization, axis = 0)
	np.savetxt('./data/tsne3d_%s.csv' % (filename), completeRes, delimiter=",", fmt='%s')
	with open('./data/tsne3d_%s.csv'% (filename), 'r') as f : 
		data = f.read()
	return 	data

@app.route("/uploadCM", methods=["POST"], strict_slashes=False)
def uploadCM():
	# print('CM')
	request_filename = request.get_json()['filename']
	# kmeans = request.get_json()['runKmeans']
	input_path = './data/PCA/' + request_filename
	df = pd.read_csv(input_path)
	pca_new = PCA(n_components=20)#, whiten=True
	principalComponents_new = pca_new.fit_transform(df)
	# if kmeans: 
	# 	labels = runKmeans(df)
	# print(principalComponents_new.shape)
	letters = string.ascii_lowercase
	filename = ''.join(random.choice(letters) for i in range(5))
	completeRes = np.append([['PC%s'%(i) for i in range(1,21)]], principalComponents_new, axis = 0)
	np.savetxt('./data/pca_%s.csv' % (filename), completeRes, delimiter=",", fmt='%s')
	with open('./data/pca_%s.csv'% (filename), 'r') as f : 
		data = f.read()
	return 	data

@app.route("/detectoutliers", methods=["POST"], strict_slashes=False)
def detectoutliers():
	print('detecting outliers')
	request_df = request.get_json()['df']
	
	request_method = request.get_json()['method']
	column_range = request.get_json()['columnRange']
	std_freedom = int(request_method[0])
	print(column_range)
	df = pd.json_normalize(request_df)
	newdf = {}

	def choose_columns(x):
		return 'PC' in x 
		# \ and int(x[-1]) >= column_range[0] \
		# 		and int(x[-1]) <= column_range[1]
	
	columns_of_interest = list(filter(choose_columns, df.columns))

	for col in columns_of_interest:
		# print(col)
		pcx = df.loc[:, col]
		pcx = pd.Series(pcx, dtype='float')
		data_mean, data_std = (pcx.mean()), (pcx.std())
		cut_off = data_std * std_freedom
		lower, upper = data_mean - cut_off, data_mean + cut_off
		
		outliers = [(1 if x < lower or x > upper else 0) for x in pcx]
		newdf[col] = outliers
		
	# letters = string.ascii_lowercase
	# filename = ''.join(random.choice(letters) for i in range(5))

	outliers_result = pd.DataFrame(newdf)
	return outliers_result.to_csv()

if __name__ == "__main__":
	app.run( debug=True)