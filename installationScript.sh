#!/bin/bash
DATE=$(date +'%F %H:%M:%S')

echo "Current date and time: $DATE"

sleep 2s # Waits 5 seconds.

cd "C:\Users\Us3r\Desktop\TestENV\PopMLViz-main"
echo "Moving into Directory"
sleep 2s # Waits 5 seconds.


echo "Making backend/data folder"
mkdir backend/data
sleep 2s # Waits 5 seconds.

echo "Moving into backend"
cd backend/
sleep 2s # Waits 5 seconds.

echo "Making a flask environment"
source flaskenv/bin/activate
sleep 2s # Waits 5 seconds.

echo "Installing flash-requirements using pip"
pip install -r flask_req.txt
sleep 2s # Waits 5 seconds.

echo "Moving into the main Directory"
cd ../
sleep 2s # Waits 5 seconds.

echo "Moving into the frontend"
cd frontend/
sleep 2s # Waits 5 seconds.

echo "Setting up enviroment variables"
echo "REACT_APP_DOMAIN=localhost" > .env
echo "REACT_APP_PROTOCOL=http" >> .env
echo "REACT_APP_PORT=:5000" >> .env
sleep 2s # Waits 5 seconds.

echo "Starting the Application"
npm install
npm start