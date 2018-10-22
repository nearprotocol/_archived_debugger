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

from near.dash_backend import db
from near.dash_backend.models import DashboardData
from near.dash_backend.service import service
from near.dash_pylib.models import ObserverData

app = Flask(__name__)
socket_io_wrapper = SocketIO(app)


@app.route('/submit-observer-data', methods=['POST'])
def index():
    # SocketIO seems to break standard the Flask JSON interface
    observer_data = json.loads(request.data)
    stats = db.process_context_and_get_stats(ObserverData(observer_data))
    dashboard_data = DashboardData({
        'observer_data': observer_data,
        'node_stats': stats,
    })
    send(
        dashboard_data.to_primitive(),
        json=True,
        broadcast=True,
        namespace='/',
    )
    return jsonify({'status': 'OK'})


@app.before_first_request
def configure_service():
    service.configure()


if __name__ == '__main__':
    socket_io_wrapper.run(app, debug=True)
