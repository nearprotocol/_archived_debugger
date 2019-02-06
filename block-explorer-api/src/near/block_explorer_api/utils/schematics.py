from __future__ import absolute_import

from schematics.types import BaseType, StringType
from schematics.exceptions import ValidationError

class EnumType(BaseType):
    def __init__(self, enum_cls, *args, **kwargs):
        super(EnumType, self).__init__(*args, **kwargs)
        self.enum_cls = enum_cls

    def to_native(self, value, context=None):
        try:
            return self.enum_cls(value)
        except ValueError as e:
            raise ValidationError(e.message)

    def to_primitive(self, value, context=None):
        return value.value


class StrippedStringType(StringType):
    def to_native(self, value, context=None):
        value = super(StrippedStringType, self).to_primitive(value, context)
        if value is not None:
            value = value.strip()

        return value
