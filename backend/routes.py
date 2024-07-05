from flask import jsonify, request, send_file
from .app import create_app
import pandas as pd
from sklearn.decomposition import PCA
import random, string
from .common import runKmeans
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
import os
import rpy2.robjects as robjects
from fcmeans import FCM
from sklearn.ensemble import IsolationForest
import pickle
from sklearn.svm import OneClassSVM
from sklearn.neighbors import LocalOutlierFactor
from sklearn.cluster import AgglomerativeClustering 
from sklearn.covariance import EllipticEnvelope
from scipy.cluster.hierarchy import dendrogram, linkage
import matplotlib
matplotlib.use('Agg')
from matplotlib import pyplot as plt
from flask import Blueprint, make_response
from flask_cors import cross_origin
from flask_bcrypt import Bcrypt
import sqlite3
from flask_jwt_extended import create_access_token,create_refresh_token, get_jwt_identity, jwt_required
from datetime import timedelta

main_blueprint = Blueprint('main', __name__)
bcrypt = Bcrypt()

# Create an application instance
app = create_app()


# Define a route to fetch the available article
UPLOAD_FOLDER = './data'

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

@app.route("/api/runkmeans", methods=["POST"], strict_slashes=False) #1
@cross_origin() 
def runKmeans():
    request_df = request.get_json()['df']
    num_clusters = request.get_json()['num_clusters']
    if num_clusters < 2:
        num_clusters = 2
    pca_df = pd.json_normalize(request_df)
    try:
        pca_cols = [x for x in pca_df.columns if 'PC' in x or 'TSNE' in x]
    except:
        pca_cols = pca_df.columns
    
    if not pca_cols:
        pca_cols = pca_df.columns
    kmeans = KMeans(n_clusters=num_clusters, random_state=123).fit_predict(pca_df[pca_cols])
    return jsonify(list(map(lambda x: int(x), kmeans)))

@app.route("/", methods=["GET"], strict_slashes=False) #2 dummy endpoint
@cross_origin()
def helloWorld():
    return "Hello World"

@app.route("/api/runhc", methods=["POST"], strict_slashes=False) #3 runs when running the ClusteringAlgorithmsTab when the algo chosen is hierarchical clustering
@cross_origin()
def runHC():
    request_df = request.get_json()['df']
    num_clusters = request.get_json()['num_clusters']
    if num_clusters < 2:
        num_clusters = 2
    pca_df = pd.json_normalize(request_df, max_level=0)
    try:
        pca_cols = [x for x in pca_df.columns if 'PC' in x or 'TSNE' in x]
    except:
        pca_cols = pca_df.columns
    
    if not pca_cols:
        pca_cols = pca_df.columns
    hc = AgglomerativeClustering(n_clusters=num_clusters, metric='euclidean', linkage='ward').fit_predict(pca_df[pca_cols])
    
    plt.figure(figsize=(10, 7))
    dendrogram(linkage(pca_df[pca_cols], method='ward'))
    plt.xticks([])
    filename = random_string(12)
    plt.savefig(f'./data/dendrogram/{filename}.png')
    return {
        'result': list(map(lambda x: int(x), hc)), 
        'filename': filename + ".png"
    }

@app.route("/api/dendrogram/<image_name>", methods=["GET"], strict_slashes=False) #4 runs inside centralPane Dendrogram tab
@cross_origin()
def dendrogramImage(image_name):
    return send_file(f'./data/dendrogram/{image_name}')

@app.route("/api/runfuzzy", methods=["POST"], strict_slashes=False) #5 runs when running the ClusteringAlgorithmsTab when the algo chosen is fuzzy c-means
@cross_origin()
def runFuzzy():
    request_df = request.get_json()['df']
    num_clusters = request.get_json()['num_clusters']
    if num_clusters < 2:
        num_clusters = 2
    pca_df = pd.json_normalize(request_df)
    try:
        pca_cols = [x for x in pca_df.columns if 'PC' in x or 'TSNE' in x]
    except:
        pca_cols = pca_df.columns
    
    if not pca_cols:
        pca_cols = pca_df.columns

    fcm = FCM(n_clusters=num_clusters, random_state=111,  max_iter=1000)
    pca_df = pca_df[pca_cols].astype('float64')
    pca_df1 = pca_df.to_numpy()
    fcm.fit(pca_df1)
    fuzzy = fcm.predict(pca_df1)
    return jsonify(list(map(lambda x: int(x), fuzzy)))

@app.route("/api/cmtsne2d", methods=["POST"], strict_slashes=False) #6
@cross_origin()
def cmtsne2d():
    request_df = request.get_json()['df']
    pca_df = pd.json_normalize(request_df)
    try:
        pca_cols = [x for x in pca_df.columns if 'PC' in x or 'TSNE' in x]
        other_cols = [x for x in pca_df.columns if 'PC' not in x and 'TSNE' not in x]
        if not pca_cols:
            pca_cols = pca_df.columns
            other_cols = []
    except:
        pca_cols = pca_df.columns
    
    tsne_visualization = TSNE(random_state=123).fit_transform(pca_df[pca_cols])
    tsne_df = pd.DataFrame(tsne_visualization)
    tsne_df.columns = ["TSNE-1", "TSNE-2"]
    results_df = pd.concat([tsne_df, pca_df[other_cols]], axis=1)
    return results_df.to_csv()

@app.route("/api/cmtsne3d", methods=["POST"], strict_slashes=False) #7
@cross_origin()
def cmtsne3d():
    request_df = request.get_json()['df']
    pca_df = pd.json_normalize(request_df)
    try:
        pca_cols = [x for x in pca_df.columns if 'PC' in x or 'TSNE' in x]
        other_cols = [x for x in pca_df.columns if 'PC' not in x and 'TSNE' not in x]
        if not pca_cols:
            pca_cols = pca_df.columns
            other_cols = []
    except:
        pca_cols = pca_df.columns
    
    tsne_visualization = TSNE(n_components=3, random_state=123).fit_transform(pca_df[pca_cols])
    tsne_df = pd.DataFrame(tsne_visualization)
    tsne_df.columns = ["TSNE-1", "TSNE-2", "TSNE-3"]
    results_df = pd.concat([tsne_df, pca_df[other_cols]], axis=1)
    return results_df.to_csv()

@app.route("/api/uploadCM", methods=["POST"], strict_slashes=False) #8
@cross_origin()
def uploadCM():
    target = './data/test_docs'
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file']
    filename = random_string(12)
    extension = '.' + file.filename.split('.')[-1]
    destination = "/".join([target, filename])
    file.save(destination + extension)
    
    if extension == ".pkl":
        cm_df = pickle.load(open(destination + extension, "rb"))
    else:
        cm_df = pd.read_csv(destination + extension)

    try:
        components = min(20, len(cm_df.columns))
        pca_new = PCA(n_components=components)
        principalComponents_new = pca_new.fit_transform(cm_df)
    except:
        cm_df = pd.read_csv(destination + extension, sep=" ")
        components = min(20, len(cm_df.columns))
        pca_new = PCA(n_components=components)
        principalComponents_new = pca_new.fit_transform(cm_df)
        
    response_df = pd.DataFrame(principalComponents_new)
    response_df.columns = ['PC' + (str(i + 1)) for i in range(components)]
    print(response_df)
    return response_df.to_csv()

def random_string(length):
    pool = string.ascii_letters + string.digits
    return ''.join(random.choice(pool) for i in range(length))

@app.route('/api/uploadPCAIR', methods=['POST']) #9
@cross_origin()
def uploadPCAIR():
    target = './data/test_docs'
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    filename = random_string(12)
    extension = '.' + file.filename.split('.')[-1]
    destination = "/".join([target, filename])
    file.save(destination + extension)
    
    return {'filename': filename}

@app.route('/api/runPCAIR', methods=['POST']) #10
@cross_origin()
def runPCAIR():
    bed_name = request.get_json()['bedName']
    bim_name = request.get_json()['bimName']
    fam_name = request.get_json()['famName']
    kinship_name = request.get_json()['kinshipName']
    gds_name = random_string(12)
    result_name = random_string(12)
    if kinship_name == "":
        robjects.r('''
        .libPaths("/home/local/QCRI/kisufaj/R/x86_64-pc-linux-gnu-library/4.1")
        library(GENESIS)
        library(SNPRelate)
        library(GWASTools)
        showfile.gds(closeall=TRUE)
        snpgdsBED2GDS(bed.fn = "./data/test_docs/%s.bed", bim.fn = "./data/test_docs/%s.bim", fam.fn ="./data/test_docs/%s.fam", out.gdsfn = "./data/test_docs/%s.gds")

        geno <- GdsGenotypeReader(filename = "./data/test_docs/%s.gds")
        genoData <- GenotypeData(geno)
        
        IDs <- read.table("./data/test_docs/%s.fam", header = FALSE)
        IDs_col <- IDs[,1]

        pcair_result_nokin <- pcair(gdsobj = genoData, kinobj = NULL, divobj = NULL, num.cores = 32)  ## Normal PCA

        pc_vectors_nokin <- as.data.frame(pcair_result_nokin$vectors[,c(1:20)])
        pc_vectors_nokin$IID <- as.character(IDs$V1)

        colnames(pc_vectors_nokin)[1:20] = paste("PC",1:20,sep="")
        write.csv(pc_vectors_nokin, "./data/test_docs/%s.csv", row.names=F,col.names=TRUE)
        ''' % (bed_name, bim_name, fam_name, gds_name, gds_name, fam_name, result_name))
    else:
        robjects.r('''
        .libPaths("/home/local/QCRI/kisufaj/R/x86_64-pc-linux-gnu-library/4.1")
        library(GENESIS)
        library(SNPRelate)
        library(GWASTools)
        showfile.gds(closeall=TRUE)
        snpgdsBED2GDS(bed.fn = "./data/test_docs/%s.bed", bim.fn = "./data/test_docs/%s.bim", fam.fn ="./data/test_docs/%s.fam", out.gdsfn = "./data/test_docs/%s.gds")

        geno <- GdsGenotypeReader(filename = "./data/test_docs/%s.gds")
        genoData <- GenotypeData(geno)
        
        kinship <- read.table("./data/test_docs/%s.txt", header = FALSE)
        IDs <- read.table("./data/test_docs/%s.fam", header = FALSE)

        IDs_col <- IDs[,1]

        colnames(kinship) <- IDs_col
        rownames(kinship) <- IDs_col
        pcair_result       <- pcair(gdsobj = genoData, kinobj = as.matrix(kinship), divobj = as.matrix(kinship), div.thresh= -2^(-9/2), kin.thresh=2^(-9/2), num.cores = 4) ## PC-air

        pc_vectors <- as.data.frame(pcair_result$vectors[,c(1:20)])
        pc_vectors$IID <- as.character(IDs$V1) 

        colnames(pc_vectors)[1:20] = paste("PC",1:20,sep="")
        write.csv(pc_vectors, "./data/test_docs/%s.csv", row.names=F,col.names=TRUE)
        ''' % (bed_name, bim_name, fam_name, gds_name, gds_name, kinship_name, fam_name, result_name))
    
    return pd.read_csv(f'./data/test_docs/{result_name}.csv').to_csv()

@app.route("/api/detectoutliers", methods=["POST"], strict_slashes=False) #11
@cross_origin()
def detectoutliers():
    def choose_columns(x):
        if input_format == "pca":
            return ('PC%d' % (x))
        else:
            return ('TSNE-%d' % (x))

    def binary(x):
        if x == 1:
            return 1
        return 0

    def outliers(x):
        if x == 1:
            return 0
        return 1
        
    request_df = request.get_json()['df']
    request_method = request.get_json()['method']
    column_range_req = request.get_json()['columnRange']
    column_range = list(range(column_range_req[0], column_range_req[1] + 1)) # [1,2,3,4,5,6,7,8,9,10]

    combine_type = int(request.get_json()['combineType'])
    std_freedom = int(request_method)
    input_format = request.get_json()['inputFormat']
    df = pd.json_normalize(request_df)
    newdf = {}

    columns_of_interest = list(map(choose_columns, column_range))
    
    #Isolation Forest
    if std_freedom == 4:
        clf = IsolationForest(contamination=0.1, random_state=123).fit_predict(df[columns_of_interest])
        clf_binary = {0: list(map(outliers, clf))}
        clf_df = pd.DataFrame(clf_binary)
        return clf_df.to_csv()
    
    #MCD
    if std_freedom == 5:
        clf = EllipticEnvelope(contamination=0.01).fit_predict(df[columns_of_interest])
        clf_binary = {0: list(map(outliers, clf))}
        clf_df = pd.DataFrame(clf_binary)
        return clf_df.to_csv()
    
    #Local Outlier Factor
    if std_freedom == 6:
        clf = LocalOutlierFactor(n_neighbors=20, contamination=.03).fit_predict(df[columns_of_interest])
        clf_binary = {0: list(map(outliers, clf))}
        clf_df = pd.DataFrame(clf_binary)
        return clf_df.to_csv()
    
    #One-Class SVM
    if std_freedom == 7:
        clf = OneClassSVM(kernel='rbf').fit_predict(df[columns_of_interest])
        clf_binary = {0: list(map(outliers, clf))}
        clf_df = pd.DataFrame(clf_binary)
        return clf_df.to_csv()
    
    #Standard Deviation
    for col in columns_of_interest:
        if col in df.columns:
            pcx = df.loc[:, col]
            pcx = pd.Series(pcx, dtype='float')
            data_mean, data_std = (pcx.mean()), (pcx.std())
            cut_off = data_std * std_freedom
            lower, upper = data_mean - cut_off, data_mean + cut_off

            outliers = [(1 if x < lower or x > upper else 0) for x in pcx]
            newdf[col] = outliers

    outliers_result = pd.DataFrame(newdf)
    
    if combine_type == 0:
        apply_combineType = outliers_result.aggregate(lambda x: all(x), axis=1)
    else:
        apply_combineType = outliers_result.aggregate(lambda x: any(x), axis=1)
    
    change_to_binary = apply_combineType.apply(binary)
    return change_to_binary.to_csv()

@app.route("/api/samplePCA/<sample_id>", methods=["GET"], strict_slashes=False) #this endpoint is not being used
@cross_origin()
def samplePCA(sample_id):
    if int(sample_id) == 0:
        pca_sample_path = './datasets/KG_PCS.csv'
        pca_sample = pd.read_csv(pca_sample_path)
    else:
        pca_sample_path = './datasets/HGDP/hgdp.csv'
        pca_sample = pd.read_csv(pca_sample_path)
    return pca_sample.to_csv()

@app.route("/api/sampleAdmix", methods=["GET"], strict_slashes=False) #12
@cross_origin()
def sampleAdmix():
    admix_sample_path = './datasets/admix_KG.5.Q'
    admix_sample = pd.read_csv(admix_sample_path, sep=' ')
    return admix_sample.to_csv(index=False, sep=' ')

@app.route("/api/samplePCAAdmixDataset/<sample_id>", methods=["GET"], strict_slashes=False) #13
@cross_origin()
def samplePCAAdmixDataset(sample_id):
    if int(sample_id) == 0:
        pca_sample_path = './datasets/KG_PCS.csv'
        admix_sample_path = './datasets/admix_KG.5.Q'
    else:
        pca_sample_path = './datasets/HGDP/hgdp.csv'
        admix_sample_path = './datasets/HGDP/hgdp.Q'
    
    pca_sample = pd.read_csv(pca_sample_path)
    admix_sample = pd.read_csv(admix_sample_path, sep=' ')

    return {
        "pca": pca_sample.to_csv(), 
        "admix": admix_sample.to_csv(index=False, sep=' ')
    }

@app.route("/api/")
@cross_origin()
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>"



@app.route('/register', methods=['POST'],  strict_slashes=False)
@cross_origin(supports_credentials=True)
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        conn = sqlite3.connect('popMLViz.db')
        c = conn.cursor()
        c.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, hashed_password))
        conn.commit()
        c.execute("select * from users") #remove this later
        c.fetchall()
        conn.close()
        return jsonify(message="User registered successfully"), 201 
    except sqlite3.IntegrityError:
        return jsonify(message="User already exists"), 409


@app.route('/login', methods=['POST'],  strict_slashes=False)
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = sqlite3.connect('popMLViz.db')
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user[2], password):
        response = make_response(jsonify(message="User logged in successfully"), 200)
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)

        response.set_cookie('access_token_cookie', access_token, httponly=True, secure=True, samesite='none', max_age=15*60 ) #secure=true means the token get sent only wehn the connection is https 
        response.set_cookie('refresh_token_cookie', refresh_token, httponly=True,secure=True, samesite='none', max_age=30*24*60*60)
        #note that access token duration is 15 minutes and refresh token duration is 30 days
        return response

    else:
        return jsonify(message="Invalid credentials"), 401



@app.route('/verify', methods=['GET'])
@cross_origin(supports_credentials=True)
@jwt_required()
def verify():
    current_user = get_jwt_identity()
    return jsonify(user=current_user), 200


@app.route('/protected', methods=['GET'])
@cross_origin(supports_credentials=True)
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@app.route('/refresh', methods=['POST'])
@cross_origin(supports_credentials=True)
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    response = make_response(jsonify(access_token=new_access_token), 200)
    response.set_cookie('access_token_cookie', new_access_token, httponly=True,secure=True, samesite='none', max_age=15*60 )
    return response
      

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)