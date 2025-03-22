from operator import add
from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import CustomTokenSerializer, add_user_role


class CustomTokenObtainPairSerializer(CustomTokenSerializer, TokenObtainPairSerializer):
    pass


class CustomTokenRefreshSerializer(CustomTokenSerializer, TokenRefreshSerializer):
    pass


class UserSerializer(ModelSerializer):
    token = serializers.SerializerMethodField()

    class Meta:
        abstract = True
        model = User
        read_only_fields = ["uid"]
        extra_kwargs = {
            "password": {"write_only": True, "validators": [validate_password]},
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
            "contact_number": {"required": True},
            "contact_number_country_code": {"required": True},
            "username": {"required": True, "write_only": True},
        }

    @staticmethod
    def validate_contact_number(value):
        print(len(str(value)))
        print(value)
        if len(str(value)) != 10:
            raise ValidationError("Contact number should be of 10 digits")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        token = add_user_role(RefreshToken.for_user(user), user)
        user._token = {"access": str(token.access_token), "refresh": str(token)}
        return user

    def get_token(self, obj):
        return getattr(obj, "_token", None)


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
        write_only_fields = ["password", "username"]


class UpdateUsernameSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=100,
        required=True,
        write_only=True,
    )
    password = serializers.CharField(write_only=True, required=True)

    def __init__(self, *args, **kwargs):
        # If updating, we pass the current instance to the UniqueValidator
        super().__init__(*args, **kwargs)

        if self.context.get("request"):
            # remove the unique validator for the username field for current instance
            self.fields["username"].validators.append(
                UniqueValidator(
                    queryset=User.objects.exclude(
                        id=self.context.get("request").user.id
                    ),
                    message="Username already exists",
                )
            )

    def validate_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise ValidationError("Incorrect")
        return value

    def validate_username(self, value):
        if len(value) < 4:
            raise ValidationError("Username should be of minimum 4 characters")
        if value == self.context["request"].user.username:
            raise ValidationError("New username should be different from the old one")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise ValidationError({"confirm_password": "Passwords do not match"})
        return data

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise ValidationError("Password is incorrect")
        return value
