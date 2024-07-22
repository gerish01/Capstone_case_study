from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only admin users to create, update, delete.
    Non-admin users can view (GET, HEAD) only.
    """

    def has_permission(self, request, view):
        # Allow all GET and HEAD requests
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the user is an admin
        return request.user.is_staff

    def has_object_permission(self, request, view, obj):
        # Allow all GET and HEAD requests
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow non-admin users to update the status of their tasks
        if request.method in ["PATCH", "PUT"] and not request.user.is_staff:
            return "status" in request.data and obj.owner == request.user

        # Check if the user is an admin for other requests
        return request.user.is_staff
