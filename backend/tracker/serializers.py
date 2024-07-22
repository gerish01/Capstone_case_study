from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import Project, Task, UserRole


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "password")
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    def create(self, validated_data):  # creation of user and token
        user = User.objects.create_user(**validated_data)
        token = Token.objects.create(user=user)
        return user


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
        )
        token, created = Token.objects.get_or_create(user=user)
        return user, token


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = "__all__"

    def get_owner_name(
        self, obj
    ):  # this checks it whether If the user is an admin (is_staff is True), it logs and shows the user naem and task
        request = self.context.get("request", None)
        if request and hasattr(request, "user"):
            user = request.user
            if user.is_staff:
                print(f"Admin user {user.username} accessing task {obj.id}")
                return obj.owner.username
        return None


class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ("id", "user", "role", "is_staff")

    def create(self, validated_data):
        user = validated_data.pop(
            "user", None
        )  # Use .pop() with default to handle missing user
        user_role = UserRole.objects.create(user=user, **validated_data)
        Token.objects.get_or_create(
            user=user
        )  # it avoid creating multiple tokens for the same user
        return user_role
