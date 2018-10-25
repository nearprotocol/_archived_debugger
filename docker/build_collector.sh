#!/bin/bash
set -e

(cd ../ && tar c --exclude="*.pyc" collector docker | sudo docker build -t near/dash-collector -f docker/Collector.dockerfile -)
