# myapp/authentication.py
from rest_framework import HTTP_HEADER_ENCODING
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _


class JWTAuthenticationBothMethods(JWTAuthentication):
    def authenticate(self, request):
        # Try to get the token from the Authorization header (Bearer)
        header_auth = super().authenticate(request)

        if header_auth is not None:
            return header_auth

        # Try to get token from cookie
        raw_token = self.get_raw_token_from_cookie(request)
        if raw_token is None:
            raise AuthenticationFailed(
                _("Authentication credentials were not provided.")
            )

        validated_token = self.get_validated_token(raw_token)

        return self.get_user(validated_token), validated_token

    @staticmethod
    def get_raw_token_from_cookie(request):
        access_token = request.COOKIES.get("access")
        if access_token is None:
            return None
        if isinstance(access_token, str):
            access_token = access_token.encode(HTTP_HEADER_ENCODING)

        return access_token
