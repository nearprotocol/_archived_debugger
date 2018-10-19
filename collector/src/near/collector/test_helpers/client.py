import random
import time
import uuid


class Block(object):
    def __init__(self):
        self._id = uuid.uuid4().hex
        self.created_at = time.time()

    def to_primitive(self):
        return {
            'id': self._id,
            'created_at': self.created_at,
        }


context = {'latest_block': None}


def _needs_new_block(latest_block):
    time_interval = random.randint(25, 30)
    return (time.time() - latest_block.created_at) > time_interval


def get_latest_block(needs_new_block_fn=_needs_new_block):
    latest_block = context['latest_block']
    if latest_block is None or needs_new_block_fn(latest_block):
        latest_block = Block()
        context['latest_block'] = latest_block

    return latest_block.to_primitive()
