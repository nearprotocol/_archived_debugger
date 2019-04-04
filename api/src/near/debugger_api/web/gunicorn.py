import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1


def on_starting(_):
    from near.debugger_api.web.helpers import on_starting
    on_starting()
