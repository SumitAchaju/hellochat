from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import UserFilter
from .models import User
from .permissions import IsOwnerOrReadOnly
from .serializer import (
    AdminUserSerializer,
    ChangePasswordSerializer,
    RegularUserSerializer,
    CustomTokenObtainPairSerializer,
    UpdateUsernameSerializer,
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
    filterset_class = UserFilter

    def get_permissions(self):
        if self.action == "create":
            return []
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return AdminUserSerializer
        return RegularUserSerializer

    @action(detail=True, methods=["patch"], url_path="update-username")
    def update_username(self, request, pk=None):
        user = self.get_object()
        serializer = UpdateUsernameSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user.username = serializer.validated_data.get("username")
        user.save()
        return Response({"status": "username updated"})

    @action(detail=True, methods=["patch"], url_path="update-password")
    def update_password(self, request, pk=None):
        user = self.get_object()
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"message": "Password updated successfully"}, status=200)
