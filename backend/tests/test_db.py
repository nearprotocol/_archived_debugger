import unittest
from statistics import mean

from near.dash_backend import db
from near.dash_backend.service import service
from near.dash_pylib.models import (
    Context,
    Peer,
    BlockInfo)


class ProcessAvgPropTimeTestCase(unittest.TestCase):
    def setUp(self):
        service.redis.flushall()

    def test_success(self):
        observer = Peer({
            'node_info': {
                'id': 'observer_id',
                'latest_block': {
                    'id': 'block_0',
                    'propagated_in': 0,
                },
            },
        })
        peer = Peer({
            'node_info': {
                'id': 'peer_id',
                'latest_block': {
                    'id': 'block_0',
                    'propagated_in': 10,
                },
            }
        })
        context = Context({
            'observer_id': 'observer_id',
            'peers': [
                observer,
                peer,
            ]
        })
        response = db.process_avg_prop_time(context)
        self.assertIn('observer_id', response)
        self.assertEqual(response['observer_id'], 0.0)
        self.assertIn('peer_id', response)
        self.assertEqual(response['peer_id'], 10.0)

        new_observer_block = BlockInfo({
            'id': 'block_1',
            'propagated_in': 10,
        })
        context.peers[0].node_info['latest_block'] = new_observer_block
        response = db.process_avg_prop_time(context)
        self.assertEqual(response['observer_id'], 5.0)
        self.assertEqual(response['peer_id'], 10.0)

        new_peer_block = BlockInfo({
            'id': 'block_1',
            'propagated_in': 20,
        })
        context.peers[1].node_info['latest_block'] = new_peer_block
        response = db.process_avg_prop_time(context)
        self.assertEqual(response['observer_id'], 5.0)
        self.assertEqual(response['peer_id'], 15.0)

    def test_rolling_average(self):
        context = Context({
            'observer_id': 'observer_id',
            'peers': [
                {
                    'node_info': {
                        'id': 'observer_id',
                    }
                }
            ]
        })
        propagated_in_times = list(range(30))
        response = None
        for i, propagated_in in enumerate(propagated_in_times):
            context.peers[0].node_info.latest_block = BlockInfo({
                'id': "block_{}".format(i),
                'propagated_in': propagated_in,
            })
            response = db.process_avg_prop_time(context)

        self.assertEqual(response['observer_id'], mean(propagated_in_times))

        context.peers[0].node_info.latest_block = BlockInfo({
            'id': 'block_30',
            'propagated_in': 30,
        })
        response = db.process_avg_prop_time(context)
        self.assertEqual(response['observer_id'], mean(range(1, 31)))
