from schematics import Model
from schematics.types import (
    BooleanType,
    FloatType,
    IntType,
    ListType,
    ModelType,
    StringType,
    TimestampType,
)


class BlockInfo(Model):
    id = StringType(required=True)
    created_at = TimestampType(required=True)
    num_txns = IntType(required=True)
    propagated_in = IntType(required=True)


class NodeInfo(Model):
    id = StringType(required=True)
    shard_id = StringType(required=True)
    stake = FloatType()
    num_peers = IntType(required=True)
    latest_block = ModelType(BlockInfo, required=True)


class Peer(Model):
    node_info = ModelType(NodeInfo, required=True)
    ping_success = BooleanType(required=True)
    latency = IntType()


class Context(Model):
    observer_id = StringType(required=True)
    peers = ListType(ModelType(Peer), default=[])


class NodeStats(Model):
    node_id = StringType(required=True)
    avg_uptime = FloatType()
    avg_prop_time = FloatType()


class GlobalStats(Model):
    avg_block_time = FloatType()
