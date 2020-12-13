#!/bin/sh

echo "Server start"
sudo kill -9 $(lsof -t -i :5000)
nodemon -d --exec npm start
