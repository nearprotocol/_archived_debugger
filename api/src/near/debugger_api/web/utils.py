from __future__ import absolute_import

from schematics import Model, ModelMeta
from schematics.types import StringType
from schematics.types.compound import (
    ListType,
    ModelType,
)

from near.debugger_api.utils.schematics import StrippedStringType


class InputSchemaMeta(ModelMeta):
    @classmethod
    def _check_field(mcs, field):
        if isinstance(field, StringType):
            assert isinstance(field, StrippedStringType)
        elif isinstance(field, ModelType):
            assert issubclass(field.model_class, InputSchema)
        elif isinstance(field, ListType):
            mcs._check_field(field.field)

    def __new__(mcs, name, bases, attrs):
        cls = super(InputSchemaMeta, mcs).__new__(mcs, name, bases, attrs)
        for field_name in cls.fields:
            mcs._check_field(getattr(cls, field_name))

        return cls


class InputSchema(Model):
    __metaclass__ = InputSchemaMeta


class ListOutputSchema(object):
    def __init__(self, object_schema):
        self.object_schema = object_schema
