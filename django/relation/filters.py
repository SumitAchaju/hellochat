import django_filters
from .models import UserRelation


class UserRelationFilters(django_filters.FilterSet):
    ids = django_filters.BaseInFilter(field_name="user__id", lookup_expr="in")

    class Meta:
        model = UserRelation
        fields = ["user__id"]
