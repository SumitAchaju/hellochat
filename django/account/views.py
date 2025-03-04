from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User
from .permissions import IsOwnerOrReadOnly
from .serializer import (
    AdminUserSerializer,
    RegularUserSerializer,
    CustomTokenObtainPairSerializer,
)
from .utils import JWTTokenCookieMixin


class CustomTokenObtainPairView(JWTTokenCookieMixin, TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(JWTTokenCookieMixin, TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            cokkie_refresh = request.COOKIES.get("refresh")
            if cokkie_refresh:
                request.data["refresh"] = cokkie_refresh
        return super().post(request, *args, **kwargs)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    permission_classes = (IsOwnerOrReadOnly, IsAuthenticated)

    def get_permissions(self):
        if self.action == "create":
            return []
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return AdminUserSerializer
        return RegularUserSerializer
