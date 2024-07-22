from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project, Task, UserRole
from .permissions import IsAdminOrReadOnly
from .serializers import (
    ProjectSerializer,
    RegisterSerializer,
    TaskSerializer,
    UserRoleSerializer,
    UserSerializer,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer  # JSON format and vice versa.
    authentication_classes = [TokenAuthentication]
    permission_classes = [
        permissions.IsAuthenticated,  # ensures that only authenticated users can access the viewset’s endpoints.
        IsAdminOrReadOnly,
    ]

    def get_queryset(
        self,
    ):  # This method determines the set of Project instances to return based on the user's role.
        user = self.request.user

        try:
            user_role = UserRole.objects.get(user=user).role
        except UserRole.DoesNotExist:
            user_role = None

        if user_role == "admin":
            return Project.objects.all()
        else:
            q_own_projects = Q(owner=user)
            q_user_tasks = Q(
                id__in=Task.objects.filter(owner=user).values_list(
                    "project_id", flat=True
                )
            )
            return Project.objects.filter(
                q_own_projects | q_user_tasks
            ).distinct()

    def create(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"error": "Only admins can create projects."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"error": "Only admins can delete projects."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["project"]
    ordering_fields = ["due_date"]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Task.objects.all()
        else:
            return Task.objects.filter(owner=user)

    def create(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"error": "Only admins can create tasks."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {"error": "Only admins can delete tasks."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.is_staff:
            return super().update(request, *args, **kwargs)
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response(
                {
                    "error": "You do not have permission to perform this action."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

    @action(detail=True, methods=["put"])
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get("status")

        if new_status not in [choice[0] for choice in Task.STATUS_CHOICES]:
            return Response(
                {"error": "Invalid status."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Ensure only the owner or admin can update the status
        if request.user.is_staff or task.owner == request.user:
            task.status = new_status
            task.save()

            serializer = self.get_serializer(task)
            return Response(serializer.data)
        else:
            return Response(
                {
                    "error": "You do not have permission to update the task status."
                },
                status=status.HTTP_403_FORBIDDEN,
            )


class RegisterViewSet(
    viewsets.ViewSet
):  # A viewset for registering new users.
    authentication_classes = []
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, token = serializer.save()  # Save user and get token
        return Response({"token": token.key}, status=status.HTTP_201_CREATED)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user, token = serializer.save()  # Save user and get token
            return Response(
                {"token": token.key}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRoleViewSet(viewsets.ModelViewSet):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    """
    User Management: The UserViewSet and RegisterViewSet/RegisterView handle user registration and management.

    Project and Task Management: The ProjectViewSet and TaskViewSet handle CRUD operations for projects and tasks, with permissions based on user roles.

    Custom Actions: The TaskViewSet includes a custom action to update task status.

    Role Management: The UserRoleViewSet handles CRUD operations for user roles.
    """
