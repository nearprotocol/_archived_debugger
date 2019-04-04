from near.debugger_api.api import DebuggerApi
from near.debugger_api.web.app import create_app
from near.debugger_api.web.helpers import get_db_uri, get_server_address

db_uri = get_db_uri()
server_address = get_server_address()
application, db_session_getter, db_session_setter = create_app()
application.api = DebuggerApi(
    server_address=server_address,
    db_uri=db_uri,
    thread_local_db_session_getter=db_session_getter,
    thread_local_db_session_setter=db_session_setter,
)

if __name__ == '__main__':
    from near.debugger_api.web.helpers import on_starting

    on_starting()
    application.run(host='0.0.0.0', port=5000, debug=True)
