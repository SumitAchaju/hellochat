from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
)


from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(self, user):
        token = super().get_token(user)

        # Assign roles based on user model fields
        if user.is_superuser:
            token["role"] = "superadmin"
        elif user.is_staff:
            token["role"] = "admin"
        else:
            token["role"] = "user"

        return token


class UserSerializer(ModelSerializer):
    class Meta:
        abstract = True
        model = User
        read_only_fields = ["uid"]
        extra_kwargs = {
            # "password": {"write_only": True, "style": {"input_type": "password"}},
            "username": {
                "write_only": True,
                "validators": [UniqueValidator(queryset=User.objects.all())],
            },
        }

    @staticmethod
    def validate_contact_number(value):
        if len(str(value)) != 10:
            raise ValidationError("Contact number should be of 10 digits")
        return value

    @staticmethod
    def validate_password(value):
        if len(value) < 8:
            raise ValidationError("Password should be of minimum 8 characters")
        return value


class AdminUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = "__all__"


class RegularUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        exclude = ["groups", "user_permissions"]
        read_only_fields = [
            "uid",
            "is_staff",
            "is_superuser",
            "is_active",
            "date_joined",
            "last_login",
        ]
