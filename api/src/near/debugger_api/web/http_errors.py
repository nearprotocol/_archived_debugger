from flask import request


class HTTPError(Exception):
    status_code = 400
    code = NotImplemented
    message = None

    def __init__(self, code=None, status_code=None, payload=None):
        Exception.__init__(self)
        if code is not None:
            if self.code is NotImplemented:
                self.code = code
            else:
                name = self.__class__.__name__
                raise Exception("cannot override default code for {}".format(name))

        if self.code is NotImplemented and code is None:
            raise Exception("code required")

        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
        if self.message is not None:
            if payload is None:
                self.payload = {}
            self.payload['message'] = self.message

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['code'] = self.code
        return rv


class JSONDataRequired(HTTPError):
    code = 'json_data_required'


class InvalidField(HTTPError):
    code = 'invalid_field'

    def __init__(self, field, message):
        assert request.url_rule.input_schema is not None
        assert field.name in request.url_rule.input_schema.fields
        super(InvalidField, self).__init__(payload={
            'field_name': field.serialized_name or field.name,
            'message': message,
        })


class InvalidInput(HTTPError):
    code = 'invalid_input'

    def __init__(self, reason):
        super(InvalidInput, self).__init__(payload={
            'invalid_input': reason
        })


class MissingFields(HTTPError):
    code = 'missing_fields'

    def __init__(self, field_names):
        super(MissingFields, self).__init__(payload={
            'fields': field_names
        })


class ResourceNotFound(HTTPError):
    status_code = 404
    code = 'not_found'
