After cloning the repository run:

```
cd VisualizePlots
mkdir /backend/data
mkdir /frontend/public/datasets
```

Add your datasets to public/datasets.

Open a terminal and run :

```
cd backend/
source /env/bin/activate
pip install -r requirements.txt
./run
```

Open another terminal and on the /frontend/ folder run:

```
cd frontend/
echo "REACT_APP_DOMAIN=localhost" > .env
npm install
npm start
```

Your web-browser will load http://localhost:3000

![1](https://github.com/Keivin98/VisualizePlots/blob/new_design/1.png?raw=true)
![2](https://github.com/Keivin98/VisualizePlots/blob/new_design/2.png?raw=true)
![3](https://github.com/Keivin98/VisualizePlots/blob/new_design/3.png?raw=true)
