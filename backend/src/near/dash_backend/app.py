import json

from flask import (
    Flask,
    jsonify,
    request,
)
from flask_socketio import (
    send,
    SocketIO,
)

app = Flask(__name__)
socket_io_wrapper = SocketIO(app)


@app.route('/submit-context', methods=['POST'])
def index():
    # SocketIO seems to break standard the Flask JSON interface
    data = json.loads(request.data)
    send(data, json=True, broadcast=True, namespace='/')
    return jsonify({'status': 'OK'})


if __name__ == '__main__':
    socket_io_wrapper.run(app, debug=True)
