from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from account.serializer import AdminUserSerializer, RegularUserSerializer
from relation.models import UserRelation


class RelationSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    friends = RegularUserSerializer(many=True, read_only=True)
    requested = RegularUserSerializer(many=True, read_only=True)
    blocked = RegularUserSerializer(many=True, read_only=True)

    class Meta:
        model = UserRelation
        fields = "__all__"

    def get_user(self, obj):
        user = self.context.get("request").user
        if user.is_staff or user.is_superuser:
            return AdminUserSerializer(obj.user).data
        return RegularUserSerializer(obj.user).data


class RelationUpdateSerializer(serializers.Serializer):
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
