from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from account.models import User
from account.permissions import IsOwnerOrReadOnly
from relation.filters import UserRelationFilters
from relation.models import UserRelation
from relation.serializer import RelationSerializer, RelationUpdateSerializer
from rest_framework.decorators import action


class RelationApiView(ModelViewSet):
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)
    allowed_methods = ["patch", "get"]
    filterset_class = UserRelationFilters
    queryset = UserRelation.objects.all()
    serializer_class = RelationSerializer
    lookup_field = "user__id"

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def get_serializer_class(self):
        if self.action == "patch":
            return RelationUpdateSerializer
        return super().get_serializer_class()

    def patch(self, request, *args, **kwargs):
        data = self.get_serializer(data=request.data)
        data.is_valid(raise_exception=True)
        requested_user = get_object_or_404(
            User, id=data.validated_data["requested_user_id"]
        )
        main_user = UserRelation.objects.get(user=request.user)

        relation_type = data.validated_data["relation"]

        if hasattr(main_user, relation_type):
            handle_relation = getattr(main_user, relation_type)
            try:
                handle_relation(requested_user)
                return Response(
                    self.get_serializer(main_user).data,
                    status=status.HTTP_200_OK,
                )
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(
                {"error": "Invalid relation type"}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        user = UserRelation.objects.get(user=request.user)
        return Response(self.get_serializer(user).data)
