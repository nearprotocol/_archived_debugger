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
from flask_sockets import Sockets

from near.dash_server import db
from near.dash_server.models import DashboardData, NodeInfo, ObserverData
from near.dash_server.service import service

app = Flask(__name__)
sockets = Sockets(app)
socket_io_wrapper = SocketIO(app)

context = {}


@socket_io_wrapper.on('connect')
def connect():
    global context
    if context != {}:
        data = {k: v.to_primitive() for k, v in context.items()}
        send(data, json=True)


@sockets.route('/sockets')
def handle_message(ws):
    pub_key = None
    global context
    while True:
        raw_message = ws.receive()
        message = json.loads(raw_message)
        if pub_key is None:
            if message['msg'] == 'system.connected':
                pub_key = message['pubkey']
                node_info = NodeInfo({
                    'name': message['name'],
                })
                context[pub_key] = node_info
            else:
                continue
        elif message['msg'] == 'system.interval':
            node_info = context[pub_key]
            node_info.peer_count = message['peers']
            node_info.block_hash = message['best']
            node_info.block_height = message['height']
            data = {pub_key: node_info.to_primitive()}
            send(
                data,
                json=True,
                broadcast=True,
                namespace='/',
            )


if __name__ == '__main__':
    service.configure()
    socket_io_wrapper.run(app, debug=True)
