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
import rpy2.robjects as robjects
from rpy2.robjects.vectors import StrVector
from rpy2.robjects.packages import importr
import rpy2.robjects.packages as rpackages
from fcmeans import FCM
from sklearn.ensemble import IsolationForest

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
	
	if not pca_cols:
		pca_cols = pca_df.columns
	kmeans = KMeans(n_clusters=num_clusters, random_state=123).fit_predict(pca_df[pca_cols])
	return jsonify(list(map(lambda x : int(x), kmeans)))

@app.route("/runfuzzy", methods=["POST"], strict_slashes=False)
def runFuzzy():
	request_df = request.get_json()['df']
	
	num_clusters = request.get_json()['num_clusters']
	if num_clusters < 2:
		num_clusters = 2
	pca_df = pd.json_normalize(request_df)
	try:
		pca_cols = [x for x in pca_df.columns if 'PC' in x]
	except:
		pca_cols = pca_df.columns
	
	if not pca_cols:
		pca_cols = pca_df.columns

	fcm = FCM(n_clusters=num_clusters)
	
	pca_df = pca_df[pca_cols].astype('float64')
	pca_df1 = (pca_df[pca_cols].to_numpy())
	
	fcm.fit(pca_df1)
	fuzzy = fcm.predict(pca_df1)
	
	return jsonify(list(map(lambda x : int(x), fuzzy)))

@app.route("/cmtsne2d", methods=["POST"], strict_slashes=False)
def cmtsne2d():
	# print('tsne')
	request_df = request.get_json()['df']
	pca_df = pd.json_normalize(request_df)
	try:
		pca_cols = [x for x in pca_df.columns if 'PC' in x]
	except:
		pca_cols = pca_df.columns
	if not pca_cols:
		pca_cols = pca_df.columns
	tsne_visualization = TSNE(random_state=123).fit_transform(pca_df[pca_cols])
	return pd.DataFrame(tsne_visualization).to_csv()

@app.route("/cmtsne3d", methods=["POST"], strict_slashes=False)
def cmtsne3d():
	# print('tsne')
	request_df = request.get_json()['df']
	pca_df = pd.json_normalize(request_df)
	try:
		pca_cols = [x for x in pca_df.columns if 'PC' in x]
	except:
		pca_cols = pca_df.columns
	if not pca_cols:
		pca_cols = pca_df.columns
	tsne_visualization = TSNE(n_components=3, random_state=123).fit_transform(pca_df[pca_cols])
	return pd.DataFrame(tsne_visualization).to_csv()

@app.route("/uploadCM", methods=["POST"], strict_slashes=False)
def uploadCM():
	target=os.path.join(UPLOAD_FOLDER,'test_docs')
	if not os.path.isdir(target):
		os.mkdir(target)
	file = request.files['file'] 
	destination="/".join([target, file.filename])
	file.save(destination)

	cm_df = pd.read_csv(destination)
	
	components = min(20, len(cm_df.columns))
	pca_new = PCA(n_components = components)

	principalComponents_new = pca_new.fit_transform(cm_df)
	# principalComponents_new.columns = ['ID'] + ['PC' + (str(i + 1)) for i in range(components)]
	response_df = pd.DataFrame(principalComponents_new)
	response_df.columns = ['ID'] + ['PC' + (str(i + 1)) for i in range(components-1)]
	return response_df.to_csv()
	
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
	#BiocManager = importr('BiocManager')
	#packnames = ('GENESIS', 'SNPRelate', 'GWASTools')
	#names_to_install = [x for x in packnames if not rpackages.isinstalled(x)]
	#if len(names_to_install) > 0:
	#	BiocManager.install(StrVector(names_to_install))
	robjects.r.source("./PCA_AIR.r", encoding="utf-8")
	
	return pd.read_csv('./data/test_docs/ALL_PCS1.csv').to_csv()


@app.route("/detectoutliers", methods=["POST"], strict_slashes=False)
def detectoutliers():
	print('detecting outliers')
	request_df = request.get_json()['df']
	
	request_method = request.get_json()['method']
	column_range_req = request.get_json()['columnRange']
	column_range = list(range(column_range_req[0], column_range_req[1] + 1)) # [1,2,3,4,5,6,7,8,9,10]

	combine_type = int(request.get_json()['combineType'])
	std_freedom = int(request_method)
	print(std_freedom)
	
	df = pd.json_normalize(request_df)
	newdf = {}

	def choose_columns(x):
		return ('PC%d' % (x))

	
	def binary(x):
		if x == 1:
			return 1
		return 0

	def outliers(x):
		if x == 1:
			return 0
		return 1
	columns_of_interest = list(map(choose_columns, column_range))
	if std_freedom > 3:
		# pc_columns = [col for col in df.columns if 'PC' in col]

		clf = IsolationForest(contamination=0.1, random_state=123).fit_predict(df[columns_of_interest])
		clf_binary = {0: list(map(outliers, clf))}
		clf_df = pd.DataFrame(clf_binary)
		print(clf_df.to_csv()[:100])
		return clf_df.to_csv()
	
	
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
	
	
	change_to_binary = apply_combineType.apply(binary)
	print(change_to_binary.to_csv()[:100])
	return change_to_binary.to_csv()

@app.route("/")
def hello():
	return "<h1 style='color:blue'>Hello There!</h1>"

if __name__ == "__main__":
	app.run(host='0.0.0.0', debug=True)
