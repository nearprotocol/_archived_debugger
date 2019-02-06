from near.block_explorer_api.service import service
from near.block_explorer_api.web.app import create_app

if __name__ == '__main__':
    app = create_app(service)


    @app.before_first_request
    def _init_db():
        with service.db.transaction_context():
            service.db.create_all()

    app.run(host='0.0.0.0', port=5000, debug=True)
