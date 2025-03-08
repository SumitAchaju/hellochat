from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms

from .models import User

from django.contrib.auth.forms import UserChangeForm


class CustomUserChangeForm(UserChangeForm):
    def clean_username(self):
        username = self.cleaned_data.get("username")
        if len(username) < 4:
            raise forms.ValidationError("Username should be at least 4 characters long")
        return username


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    form = CustomUserChangeForm
    list_display = ("username", "email", "contact_number", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "contact_number_country_code",
                    "contact_number",
                    "username",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )
    search_fields = ("username", "email", "contact_number")
    ordering = ("-date_joined",)
