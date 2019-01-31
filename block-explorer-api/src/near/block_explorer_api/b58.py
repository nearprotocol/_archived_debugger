alphabet = b'123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'


def b58encode_int(i, default_one=True):
    """Encode an integer using Base58"""
    if not i and default_one:
        return alphabet[0:1]

    string = b''
    while i:
        i, idx = divmod(i, 58)
        string = alphabet[idx:idx + 1] + string
    return string


def b58encode(v):
    """Encode a string using Base58"""
    pad_size = len(v)
    v = v.lstrip(b'\0')
    pad_size -= len(v)

    p, acc = 1, 0
    for c in reversed(list(bytearray(v))):
        acc += p * c
        p = p << 8

    result = b58encode_int(acc, default_one=False)

    return alphabet[0:1] * pad_size + result
