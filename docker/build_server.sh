#!/bin/bash

(cd ../ && tar c --exclude="*.pyc" pylib server docker | sudo docker build -t near/dash-server -f docker/Server.dockerfile -)
