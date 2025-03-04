from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class RelationSerializer(serializers.Serializer):
    requested_user_id = serializers.IntegerField(required=True)
    relation = serializers.CharField(required=True, max_length=20)

    @staticmethod
    def validate_relation(value):
        if value not in relation_type:
            raise ValidationError(f"relation must be one of {relation_type}")
        return value


relation_type = (
    "request",
    "accept",
    "block",
    "cancel_request",
    "reject",
    "unfriend",
    "unblock",
)
