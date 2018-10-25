#!/bin/bash
set -e

(cd ../ && tar c --exclude="*.pyc" pylib mock-node docker | sudo docker build -t near/dash-mock-node -f docker/MockNode.dockerfile -)
