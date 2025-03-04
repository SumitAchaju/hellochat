"""
URL configuration for chatapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenVerifyView,
)
from account.views import CustomTokenObtainPairView, CustomTokenRefreshView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/user/", include("account.urls")),
    path("api/v1/relation/", include("relation.urls")),
    path(
        "api/v1/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path(
        "api/v1/token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"
    ),
    path("api/v1/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
