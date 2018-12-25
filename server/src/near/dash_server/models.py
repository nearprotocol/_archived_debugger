from schematics import Model
from schematics.types import (
    FloatType,
    IntType,
    ListType,
    ModelType,
    StringType,
)


class NodeInfo(Model):
    name = StringType(required=True)
    peer_count = IntType()
    block_hash = StringType()
    block_height = IntType()


class Peer(Model):
    node_info = ModelType(NodeInfo, required=True)
    ping_success = BooleanType(required=True)
    latency = IntType()


class ObserverData(Model):
    observer_id = StringType(required=True)
    peers = ListType(ModelType(Peer), default=[])


class NodeStats(Model):
    node_id = StringType(required=True)
    avg_prop_time = FloatType(required=True)


class DashboardData(Model):
    observer_data = ModelType(ObserverData)
    node_stats = ListType(ModelType(NodeStats))


class BlockInfo(Model):
    id = StringType(required=True)
    created_at = FloatType(required=True)
    num_txns = IntType(required=True)
    propagated_in = IntType(required=True)
