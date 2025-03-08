from django.urls import path,include
from .views import RelationApiView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"", RelationApiView, basename="relation")

urlpatterns = [
    path("", include(router.urls)),
]
