#!/bin/bash

(cd ../ && tar c --exclude="web-ui/node_modules" web-ui docker | sudo docker build -t near/dash-web-ui -f docker/WebUI.dockerfile -)
