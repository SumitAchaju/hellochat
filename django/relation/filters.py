import django_filters.rest_framework as filters
from .models import UserRelation


class UserRelationFilters(filters.FilterSet):
    ids = filters.BaseInFilter(field_name="user__id", lookup_expr="in")

    class Meta:
        model = UserRelation
        fields = ["friends__id", "requested__id", "blocked__id"]
