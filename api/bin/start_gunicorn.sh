#!/bin/bash

REPO_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null && pwd )"
(cd ${REPO_DIR} && pipenv run gunicorn -c src/near/debugger_api/web/gunicorn.py near.debugger_api.web.run)
