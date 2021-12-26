After cloning the repository run:

```
cd VisualizePlots
mkdir /backend/data
mkdir /frontend/public/datasets
```

Add your PSA datasets to public/datasets.

Open a terminal and on the /backend folder run :

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

Choose the proper form of input, whether it is a Correlation Matrix or a PSA format.\n
Choose the axis that you want to show, after picking between 2D or 3D.\n
Result should be like this:
![2D](https://github.com/Keivin98/VisualizePlots/blob/main/2d.png?raw=true)
![3D](https://github.com/Keivin98/VisualizePlots/blob/main/3d.png?raw=true)
