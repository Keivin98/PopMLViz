After cloning the repository run:

```console
foo@bar:~$ cd PopMLViz
foo@bar:~$ mkdir backend/data
```

Add your datasets to public/datasets.

Open a terminal and run :

```console
foo@bar:~$ cd backend/
foo@bar:~$ source flaskenv/bin/activate
foo@bar:~$ pip install -r flask_req.txt
foo@bar:~$ ./run
```

Open another terminal and on the /frontend/ folder run:

```console
foo@bar:~$ cd frontend/
foo@bar:~$ echo "REACT_APP_DOMAIN=localhost" > .env
foo@bar:~$ echo "REACT_APP_PROTOCOL=http" >> .env
foo@bar:~$ npm install
foo@bar:~$ npm start
```

Your web-browser will load on http://localhost:3000

![1](https://github.com/Keivin98/VisualizePlots/blob/main/1.png?raw=true)
![2](https://github.com/Keivin98/VisualizePlots/blob/main/2.png?raw=true)
![3](https://github.com/Keivin98/VisualizePlots/blob/main/3.png?raw=true)
