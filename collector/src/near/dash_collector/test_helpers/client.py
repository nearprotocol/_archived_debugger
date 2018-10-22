import random
import time
import uuid

from near.dash_pylib.models import (
    BlockInfo,
    NodeInfo,
    ObserverData,
    Peer,
)


def _generate_num_peers():
    num_peers = int(random.normalvariate(15, 2))
    return min(max(num_peers, 10), 20)


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
        return random.random() > .01
    elif random.random() < .0001:
        return not existing_ping_success
    else:
        return existing_ping_success


def _generate_latency(existing_latency=None):
    if existing_latency is None:
        latency = int(random.normalvariate(100, 50))
    elif random.random() < .01:
        average_difference = 0
        difference_range = 10
        variation = random.choice(
            range(
                average_difference - difference_range,
                average_difference + difference_range + 1,
            ),
        )
        latency = int(existing_latency + variation)
    else:
        latency = existing_latency
    return max(3, latency)


def _generate_peer(shard_id, is_observer=False):
    node_info = _generate_node_info(shard_id)
    latency = None
    if is_observer:
        ping_success = True
    else:
        ping_success = _generate_ping_success()
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
    peers = []
    for i in range(num_peers):
        is_observer = (i == 0)
        peer_shard_id = random.choice(shards)
        peer = _generate_peer(peer_shard_id, is_observer)
        peers.append(peer)

    return ObserverData({
        'observer_id': peers[0].node_info.id,
        'peers': peers,
    })


class State(object):
    def __init__(self):
        self.context = _generate_context()
        self._latest_block_data = None

    def _update_latest_block_if_needed(self, node_info):
        if (node_info.latest_block is None or
                node_info.latest_block.id != self._latest_block_data['id']):
            new_block_propagated = bool(random.normalvariate(0, 2))
            if node_info.latest_block is None or new_block_propagated:
                propagated_in = int(max(5, random.normalvariate(500, 200)))
                block_data = dict(
                    propagated_in=propagated_in,
                    **self._latest_block_data,
                )
                node_info.latest_block = BlockInfo(block_data)

    def _perturb_peer(self, peer):
        if peer.node_info.id != self.context.observer_id:
            peer.ping_success = _generate_ping_success(peer.ping_success)

        if peer.ping_success:
            self._update_latest_block_if_needed(peer.node_info)
            if peer.node_info.id != self.context.observer_id:
                peer.latency = _generate_latency(peer.latency)

    def _needs_new_block(self):
        if self._latest_block_data is None:
            return True

        time_interval = random.normalvariate(10, 2)
        last_created_at = self._latest_block_data['created_at']
        return (time.time() - last_created_at) > time_interval

    def _create_new_block(self):
        _id = _generate_id()
        num_txns = max(1, int(random.normalvariate(100, 20)))
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

        for peer in self.context.peers:
            self._perturb_peer(peer)


state = None


def get_observer_data():
    global state
    if state is None:
        state = State()
    state.perturb_context()
    return state.context.to_primitive()


if __name__ == '__main__':
    while True:
        print(get_observer_data())
        time.sleep(1)
