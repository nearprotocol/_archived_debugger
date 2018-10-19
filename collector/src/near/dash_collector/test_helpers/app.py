from flask import (
    Flask,
    jsonify,
)

from near.dash_collector.test_helpers import client

app = Flask(__name__)

action_fns = {
    'get-latest-block': client.get_latest_block,
}


@app.route('/<action>', methods=['GET'])
def get_action(action):
    action_fn = action_fns[action]
    value = action_fn()
    response_data = {'value': value}
    return jsonify(response_data)


if __name__ == '__main__':
    app.run(port=5001, debug=True)
