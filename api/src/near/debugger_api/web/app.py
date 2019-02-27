import json

from flask import Flask, g, jsonify, request, Request
from schematics.exceptions import ConversionError, ValidationError
from schematics.types import BaseType
from werkzeug.routing import Rule
from werkzeug.utils import cached_property

from near.debugger_api.web.blueprint import blueprint
from near.debugger_api.web.http_errors import (
    HTTPError, InvalidField, InvalidInput, JSONDataRequired, MissingFields,
    ResourceNotFound,
)
from near.debugger_api.web.utils import InputSchema, ListOutputSchema


class CustomRule(Rule):
    def __init__(
            self,
            string,
            input_schema=None,
            output_schema=None,
            errors=None,
            cached=False,
            **options
    ):
        if input_schema is not None:
            assert issubclass(input_schema, InputSchema), input_schema.__name__
        self.input_schema = input_schema
        self.output_schema = output_schema
        self.errors = errors
        self.cached = cached
        super(CustomRule, self).__init__(string, **options)


class InputSchemaNotSetForRule(Exception):
    pass


class CustomRequest(Request):
    @cached_property
    def input_data_model(self):
        if self.url_rule.input_schema is not None:
            schema = self.url_rule.input_schema
            data = request.get_json(silent=True)
            if data is None or data is False:
                if request.method == 'GET':
                    data = request.args

            try:
                model = schema(data, strict=False)
                model.validate()
                return model
            except (ConversionError, ValidationError) as e:
                invalid_field_name = None
                missing_fields = []
                for field_name, message in e.messages.items():
                    for _message in message:
                        if _message == BaseType.MESSAGES['required']:
                            missing_fields.append(field_name)
                        else:
                            invalid_field_name = field_name

                if len(missing_fields) > 0:
                    if request.method == 'POST' and (data is None or data is False):
                        raise JSONDataRequired
                    raise MissingFields(sorted(missing_fields))
                raise InvalidField(
                    schema.fields[invalid_field_name],
                    e.message[invalid_field_name][0],
                )
        else:
            raise InputSchemaNotSetForRule


class CustomFlask(Flask):
    request_class = CustomRequest
    url_rule_class = CustomRule


def _handle_http_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


def create_app():
    app = CustomFlask(__name__)

    getter, setter = _get_db_session_setters_and_getters(app)

    _enforce_no_cache_headers_for_json(app)

    _enforce_request_data_validation(app)
    _enforce_response_data_validation(app)

    _register_blueprints(app)
    app.register_error_handler(HTTPError, _handle_http_error)

    return app, getter, setter


def _enforce_request_data_validation(app):
    def _validate_request_data():
        if request.url_rule is not None \
                and request.url_rule.input_schema is not None:
            assert isinstance(
                request.input_data_model,
                request.url_rule.input_schema
            )

    app.before_request(_validate_request_data)


def _validate_ok_response(response):
    data = json.loads(response.data)
    output_schema = request.url_rule.output_schema
    if output_schema is None:
        raise Exception('output_schema must be specified '
                        'in route for json responses')

    if isinstance(output_schema, ListOutputSchema):
        assert isinstance(data, list)
        output_schema = output_schema.object_schema
    else:
        data = [data]

    for item in data:
        output_schema(item).validate()


def _validate_error_response(response):
    data = json.loads(response.data)
    error_matched = False
    errors = [
        InvalidField,
        InvalidInput,
        JSONDataRequired,
        MissingFields,
        ResourceNotFound,
    ]
    if request.url_rule.errors is not None:
        errors += request.url_rule.errors

    for error in errors:
        if response.status_code == error.status_code \
                and data['code'] == error.code:
            error_matched = True
            break
    if not error_matched:
        raise Exception(
            "unexpected error raised. code: '{}'".format(data['code'])
        )


def _enforce_response_data_validation(app):
    def _validate_response_data(response):
        if response.headers['content-type'].startswith('application/json'):
            if response.status_code == 200:
                _validate_ok_response(response)
            else:
                _validate_error_response(response)
        elif request.url_rule is not None and request.url_rule.output_schema is not None:
            raise Exception('output schema set, but no json returned')
        return response

    app.after_request(_validate_response_data)


def _get_db_session_setters_and_getters(app):
    def _get_request_db_session():
        return getattr(g, 'db_session', None)

    def _set_request_db_session(session):
        g.db_session = session

    def _remove_session(response):
        if hasattr(g, 'db_session'):
            g.db_session.remove()
        return response

    app.after_request(_remove_session)

    return _get_request_db_session, _set_request_db_session


def _enforce_no_cache_headers_for_json(app):
    def _add_no_cache_headers_for_json(response):
        # just gonna hit this one with a hammer
        # http://stackoverflow.com/a/2068407
        if response.headers['content-type'].startswith('application/json'):
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
        return response

    app.after_request(_add_no_cache_headers_for_json)


def _register_blueprints(app):
    sub_apps = [
        {
            'url_prefix': '',
            'blueprint': blueprint,
        },
    ]
    for sub_app in sub_apps:
        app.register_blueprint(
            sub_app['blueprint'],
            url_prefix=sub_app['url_prefix']
        )
