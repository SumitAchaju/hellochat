from django.contrib import admin

from .models import UserRelation


@admin.register(UserRelation)
class UserRelationAdmin(admin.ModelAdmin):
    model = UserRelation
    list_display = ("user",)
    list_filter = ("user",)
