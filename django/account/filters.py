import django_filters
from .models import User

class UserFilter(django_filters.rest_framework.FilterSet):
    ids = django_filters.BaseInFilter(field_name="id",lookup_expr="in")
    class Meta:
        model = User
        fields = {
            'username': ['exact'],
            'uid': ['exact'],
            'first_name': ['icontains'],
            'last_name': ['icontains'],
        }








