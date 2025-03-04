from django.urls import path
from .views import RelationApiView

urlpatterns = [
    path("", RelationApiView.as_view(), name="relation"),
]
