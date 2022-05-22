After cloning the repository run:

```
cd PopMLViz
mkdir backend/data
```

Add your datasets to public/datasets.

Open a terminal and run :

```
cd backend/
source flaskenv/bin/activate
pip install -r flask_req.txt
./run
```

Open another terminal and on the /frontend/ folder run:

```
cd frontend/
echo "REACT_APP_DOMAIN=localhost" > .env
echo "REACT_APP_PROTOCOL=http" >> .env
npm install
npm start
```

Your web-browser will load on http://localhost:3000

![1](https://github.com/Keivin98/VisualizePlots/blob/main/1.png?raw=true)
![2](https://github.com/Keivin98/VisualizePlots/blob/main/2.png?raw=true)
![3](https://github.com/Keivin98/VisualizePlots/blob/main/3.png?raw=true)
