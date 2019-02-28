#!/bin/bash
NUM_CORES=$(cat /proc/cpuinfo | awk '/^processor/{print $3}' | wc -l)
NUM_WORKERS=$((NUM_CORES * 2 + 1))

REPO_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null && pwd )"
(cd ${REPO_DIR} && pipenv run gunicorn -w ${NUM_WORKERS} -k gevent near.debugger_api.web.run)
