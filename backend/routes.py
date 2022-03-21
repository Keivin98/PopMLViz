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
import os
import subprocess
# Create an application instance

app = create_app()
# Define a route to fetch the avaialable article
UPLOAD_FOLDER = './data/'

@app.route("/runkmeans", methods=["POST"], strict_slashes=False)
def runKmeans():
	request_df = request.get_json()['df']
	
	num_clusters = request.get_json()['num_clusters']
	if num_clusters < 2:
		num_clusters = 2
	pca_df = pd.json_normalize(request_df)
	try:
		pca_cols = [x for x in pca_df.columns if 'PC' in x]
	except:
		pca_cols = pca_df.columns
	kmeans = KMeans(n_clusters=num_clusters, random_state=123).fit_predict(pca_df[pca_cols])
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
	
	request_df = request.get_json()['df']
	# print(request_df)
	cm_df = pd.json_normalize(request_df)
	components = min(20, len(cm_df.columns))
	pca_new = PCA(n_components = components)
	print(2)
	principalComponents_new = pca_new.fit_transform(cm_df)
	completeRes = pd.DataFrame(principalComponents_new, columns=['PC%s'%(i) for i in range(1,components + 1)])
	return completeRes.to_json()
	
@app.route('/uploadPCAIR', methods=['POST'])
def uploadPCAIR():
	target=os.path.join(UPLOAD_FOLDER,'test_docs')
	if not os.path.isdir(target):
		os.mkdir(target)
	# logger.info("welcome to upload`")
	file = request.files['file'] 
	# filename = secure_filename(file.filename)
	destination="/".join([target, file.filename])
	file.save(destination)
	# session['uploadFilePath']=destination
	response="Whatever you wish too return"
	return response

@app.route('/runPCAIR', methods=['POST'])
def runPCAIR():
	subprocess.run(["sudo", "Rscript", "PCA_AIR.r"])
	
	return pd.read_csv('./data/test_docs/ALL_PCS1.csv').to_csv()



@app.route("/detectoutliers", methods=["POST"], strict_slashes=False)
def detectoutliers():
	print('detecting outliers')
	request_df = request.get_json()['df']
	
	request_method = request.get_json()['method']
	column_range_req = request.get_json()['columnRange']
	column_range = list(range(column_range_req[0], column_range_req[1] + 1)) # [1,2,3,4,5,6,7,8,9,10]

	combine_type = int(request.get_json()['combineType'])
	std_freedom = int(request_method[0])
	df = pd.json_normalize(request_df)
	newdf = {}

	def choose_columns(x):
		return ('PC%d' % (x))

	columns_of_interest = list(map(choose_columns, column_range))

	for col in columns_of_interest:
		# print(col)
		if col in (df.columns):
			pcx = df.loc[:, col]
			pcx = pd.Series(pcx, dtype='float')
			data_mean, data_std = (pcx.mean()), (pcx.std())
			cut_off = data_std * std_freedom
			lower, upper = data_mean - cut_off, data_mean + cut_off

			outliers = [(1 if x < lower or x > upper else 0) for x in pcx]
			newdf[col] = outliers

	outliers_result = pd.DataFrame(newdf)
	if combine_type == 0:
		apply_combineType = outliers_result.aggregate(lambda x : all(x), axis=1)
	else:
		apply_combineType = outliers_result.aggregate(lambda x : any(x), axis=1)
	
	def binary(x):
		if x :
			return 1
		return 0
	change_to_binary = apply_combineType.apply(binary)
	
	return change_to_binary.to_csv()

@app.route("/")
def hello():
	return "<h1 style='color:blue'>Hello There!</h1>"

if __name__ == "__main__":
	app.run(host='0.0.0.0', debug=True)
