#!/bin/sh
sudo kill -9 $(lsof -t -i :3000)
echo "Server starting..."
npm start
