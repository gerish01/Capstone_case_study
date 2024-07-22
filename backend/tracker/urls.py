from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ProjectViewSet,
    RegisterViewSet,
    TaskViewSet,
    UserRoleViewSet,
    UserViewSet,
)

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"tasks", TaskViewSet, basename="task")
router.register(r"userroles", UserRoleViewSet, basename="userrole")
router.register(r"register", RegisterViewSet, basename="register")
router.register(r"users", UserViewSet)  # Use UserViewSet here

urlpatterns = [
    path("", include(router.urls)),
]
