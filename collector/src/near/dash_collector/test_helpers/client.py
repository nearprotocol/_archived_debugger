import random
import time
import uuid

from near.dash_pylib.models import (
    BlockInfo,
    Context,
    NodeInfo,
    Peer,
)


def _generate_num_peers():
    return random.randint(2, 3)


def _generate_id():
    return uuid.uuid4().hex


def _generate_node_info(shard_id, num_peers=None):
    _id = _generate_id()

    if num_peers is None:
        num_peers = _generate_num_peers()

    stake = random.random()

    return NodeInfo({
        'id': _id,
        'shard_id': shard_id,
        'stake': stake,
        'num_peers': num_peers,
    })


def _generate_ping_success(existing_ping_success=None):
    if existing_ping_success is None:
        return random.random() > .05
    elif random.random() > .05:
        return not existing_ping_success
    else:
        return existing_ping_success


def _generate_latency(existing_latency=None):
    if existing_latency is None:
        average_latency = 100
        latency_range = 25
        return random.randint(
            average_latency - latency_range,
            average_latency + latency_range,
        )
    else:
        average_factor = 1
        factor_range = .2
        factor = ((average_factor + factor_range / 2)
                  - (factor_range * random.random()))
        return int(existing_latency * factor)


def _generate_peer(shard_id):
    node_info = _generate_node_info(shard_id)
    ping_success = _generate_ping_success()
    latency = None
    if ping_success:
        latency = _generate_latency()
    return Peer({
        'node_info': node_info,
        'ping_success': ping_success,
        'latency': latency,
    })


def _generate_context():
    num_shards = random.randint(2, 3)
    shards = [_generate_id() for _ in range(num_shards)]

    num_peers = _generate_num_peers()
    node_shard_id = random.choice(shards)
    node_info = _generate_node_info(node_shard_id, num_peers)

    peers = []
    for _ in range(num_peers):
        peer_shard_id = random.choice(shards)
        peer = _generate_peer(peer_shard_id)
        peers.append(peer)

    return Context({
        'node_info': node_info,
        'peers': peers,
    })


class State(object):
    def __init__(self):
        self.context = _generate_context()
        self._latest_block_data = None

    def _update_latest_block_if_needed(self, node_info):
        if (node_info.latest_block is None or
                node_info.latest_block.id != self._latest_block_data['id']):
            propagation_time = 10 * random.random()
            last_created_at = self._latest_block_data['created_at']
            if (time.time() - last_created_at) > propagation_time:
                block_data = dict(
                    propagated_in=int(propagation_time * 1000),
                    **self._latest_block_data,
                )
                node_info.latest_block = BlockInfo(block_data)

    def _perturb_peer(self, peer):
        self._update_latest_block_if_needed(peer.node_info)
        peer.ping_success = _generate_ping_success(peer.ping_success)
        if peer.ping_success:
            peer.latency = _generate_latency(peer.latency)

    def _needs_new_block(self):
        if self._latest_block_data is None:
            return True

        average_interval = 30
        interval_range = 5
        time_interval = ((average_interval + interval_range / 2)
                         - (interval_range * random.random()))
        last_created_at = self._latest_block_data['created_at']
        return (time.time() - last_created_at) > time_interval

    def _create_new_block(self):
        _id = _generate_id()
        num_txns = random.randint(50, 150)
        created_at = time.time()
        self._latest_block_data = {
            'id': _id,
            'created_at': created_at,
            'num_txns': num_txns,
        }
        block_data = dict(propagated_in=0, **self._latest_block_data)
        self.context.latest_block = BlockInfo(block_data)

    def perturb_context(self):
        if self._needs_new_block():
            self._create_new_block()

        self._update_latest_block_if_needed(self.context.node_info)
        for peer in self.context.peers:
            self._perturb_peer(peer)


state = None


def get_context():
    global state
    if state is None:
        state = State()
    state.perturb_context()
    return state.context.to_primitive()


if __name__ == '__main__':
    while True:
        print(get_context())
        time.sleep(1)
