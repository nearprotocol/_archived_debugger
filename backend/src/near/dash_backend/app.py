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


@app.route('/submit-latest-block', methods=['POST'])
def index():
    data = request.get_json()
    send(data, json=True, broadcast=True, namespace='/')
    return jsonify({'status': 'OK'})


if __name__ == '__main__':
    socket_io_wrapper.run(app, debug=True)
