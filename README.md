# Dashboard

## Development

Don't forget to run the `nearcore` node first.

Run backend:

    virtualenv .env --python=python3
    # Activate .env, e.g. .env/bin/activate
    
    cd block-explorer-api/
    python setup.py install

    cd src/near/block_explorer_api
    python app.py

Run frontend:

    cd web-ui/
    npm install
    cat "REACT_APP_API_URL=http://127.0.0.1:5000" > .env
    npm start


