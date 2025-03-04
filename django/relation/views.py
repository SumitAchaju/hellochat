from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from account.models import User
from relation.models import UserRelation
from relation.serializer import RelationSerializer


class RelationApiView(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request, *args, **kwargs):
        data = RelationSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        requested_user = self.get_requested_user()
        main_user = UserRelation.objects.get(user=request.user)

        relation_type = data.validated_data["relation"]

        if hasattr(main_user, relation_type):
            handle_relation = getattr(main_user, relation_type)
            try:
                handle_relation(requested_user)
                return Response(
                    {"message": f"{relation_type} successfully"},
                    status=status.HTTP_200_OK,
                )
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(
                {"error": "Invalid relation type"}, status=status.HTTP_400_BAD_REQUEST
            )

    def get_queryset(self):
        request_id = self.request.data.get("requested_user_id")
        return User.objects.get(id=request_id)

    def get_requested_user(self):
        obj = self.get_queryset()
        self.check_object_permissions(self.request, obj)
        return obj
