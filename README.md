After cloning the repository run:

```
cd VisualizePlots
mkdir /backend/data
mkdir /frontend/public/datasets
```

Add your data PSA datasets to public/datasets.

Open a terminal and on the /backend/ folder run :

```
source /venv/bin/activate
flask run
```

Open another terminal and on the /frontend/ folder run:

```
npm install
npm run
```

Your web-browser will load http://localhost:3000

Choose the proper form of input, whether it is a Correlation Matrix or a PSA format.
Choose the axis that you want to show, after picking between 2D or 3D.
