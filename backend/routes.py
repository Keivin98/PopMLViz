from flask import current_app,jsonify,request
from app import create_app,db
from models import Articles,articles_schema
import io
import pandas as pd
from sklearn.decomposition import PCA
import csv, random, string
import numpy as np
from common import runKmeans
from sklearn.cluster import KMeans

# Create an application instance
app = create_app()

# Define a route to fetch the avaialable articles

@app.route("/articles", methods=["GET"], strict_slashes=False)
def articles():

	articles = Articles.query.all()
	results = articles_schema.dump(articles)

	return jsonify(results)

@app.route("/runkmeans", methods=["POST"], strict_slashes=False)
def runKmeans():
	request_filename = request.get_json()['filename']
	num_clusters = request.get_json()['num_clusters']
	input_path = './data/PCA/' + request_filename
	print(input_path)
	pca_df = pd.read_csv(input_path)
	print(pca_df)
	kmeans = KMeans(n_clusters=num_clusters, random_state=0).fit_predict(pca_df.iloc[:, 1:-1])
	print(kmeans)
	return jsonify(list(map(lambda x : int(x), kmeans)))

@app.route("/uploadCM", methods=["POST"], strict_slashes=False)
def uploadCM():
	print('CM')
	request_filename = request.get_json()['filename']
	# kmeans = request.get_json()['runKmeans']
	input_path = './data/PCA/' + request_filename
	df = pd.read_csv(input_path)
	pca_new = PCA(n_components=20)#, whiten=True
	principalComponents_new = pca_new.fit_transform(df)
	# if kmeans: 
	# 	labels = runKmeans(df)
	print(principalComponents_new.shape)
	letters = string.ascii_lowercase
	filename = ''.join(random.choice(letters) for i in range(5))
	completeRes = np.append([['PC%s'%(i) for i in range(1,21)]], principalComponents_new, axis = 0)
	np.savetxt('./data/pca_%s.csv' % (filename), completeRes, delimiter=",", fmt='%s')
	with open('./data/pca_%s.csv'% (filename), 'r') as f : 
		data = f.read()
	return 	data

if __name__ == "__main__":
	app.run(debug=True)