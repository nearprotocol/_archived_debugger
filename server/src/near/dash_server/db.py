from statistics import mean

from near.dash_server.models import NodeStats
from near.dash_server.service import service


def _get_last_block_id_key(observer_id, peer_id):
    return "{}:{}:last_block_id".format(observer_id, peer_id)


def _get_last_prop_times_key(observer_id, peer_id):
    return "{}:{}:last_prop_times".format(observer_id, peer_id)


def process_avg_prop_time(context):
    observer_id = context.observer_id
    peers = {peer.node_info.id: peer.node_info for peer in context.peers}
    peer_ids = peers.keys()
    last_block_id_keys = [
        _get_last_block_id_key(observer_id, peer_id)
        for peer_id in peer_ids
    ]
    last_block_ids = service.redis.mget(last_block_id_keys)

    n_prop_times = 30
    pipe = service.redis.pipeline()
    for peer_id, block_id in zip(peer_ids, last_block_ids):
        peer = peers[peer_id]
        latest_block = peer.latest_block
        if latest_block is None:
            continue
        if block_id is None or block_id.decode('utf-8') != latest_block.id:
            last_block_id_key = _get_last_block_id_key(
                observer_id,
                peer_id,
            )
            last_prop_times_key = _get_last_prop_times_key(
                observer_id,
                peer_id,
            )
            pipe.set(last_block_id_key, latest_block.id)
            pipe.lpush(last_prop_times_key, latest_block.propagated_in)
            pipe.ltrim(last_prop_times_key, 0, n_prop_times - 1)

    for peer_id in peer_ids:
        last_prop_times_key = _get_last_prop_times_key(
            observer_id,
            peer_id,
        )
        pipe.lrange(last_prop_times_key, 0, n_prop_times - 1)

    response = pipe.execute()
    last_prop_times = response[-len(peer_ids):]
    output = {}
    for peer_id, last_prop_times_for_peer in zip(peer_ids, last_prop_times):
        if len(last_prop_times_for_peer) > 0:
            output[peer_id] = mean(map(float, last_prop_times_for_peer))

    return output


def process_context_and_get_stats(context):
    stats = []
    for node_id, avg_prop_time in process_avg_prop_time(context).items():
        stats.append(NodeStats({
            'node_id': node_id,
            'avg_prop_time': avg_prop_time,
        }))
    return stats
