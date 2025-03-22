import django_filters.rest_framework as django_filters
from .models import User
from django.db.models import Q


class UserFilter(django_filters.FilterSet):
    ids = django_filters.BaseInFilter(field_name="id", lookup_expr="in")
    name = django_filters.CharFilter(method="filter_by_name", label="Name")

    def filter_by_name(self, queryset, name, value):
        """
        Filter users where the first_name and last_name together match `full_name`.
        """
        words = value.split()  # Split full name into parts
        print(name)
        if len(words) == 1:
            # If only one word is given, search in both first_name and last_name
            return queryset.filter(
                Q(first_name__icontains=value) | Q(last_name__icontains=value)
            )
        else:
            # If multiple words are given, assume first and last name are separate
            return queryset.filter(
                Q(first_name__icontains=words[0]) & Q(last_name__icontains=words[-1])
            )

    class Meta:
        model = User
        fields = {
            "username": ["exact"],
            "uid": ["exact"],
            "first_name": ["icontains"],
            "last_name": ["icontains"],
            "email": ["exact"],
            "contact_number": ["exact"],
        }
