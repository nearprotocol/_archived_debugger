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

from near.dash_pylib.models import ObserverData
from near.dash_server import db
from near.dash_server.models import DashboardData
from near.dash_server.service import service

app = Flask(__name__)
socket_io_wrapper = SocketIO(app)

last_submitted_data = None


@socket_io_wrapper.on('connect')
def connect():
    global last_submitted_data
    if last_submitted_data is not None:
        send(last_submitted_data, json=True)


@app.route('/submit-observer-data', methods=['POST'])
def index():
    # SocketIO seems to break standard the Flask JSON interface
    observer_data = json.loads(request.data)
    stats = db.process_context_and_get_stats(ObserverData(observer_data))
    dashboard_data = DashboardData({
        'observer_data': observer_data,
        'node_stats': stats,
    })
    global last_submitted_data
    last_submitted_data = dashboard_data.to_primitive()
    send(
        dashboard_data.to_primitive(),
        json=True,
        broadcast=True,
        namespace='/',
    )
    return jsonify({'status': 'OK'})


if __name__ == '__main__':
    service.configure()
    socket_io_wrapper.run(app, debug=True)
