from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
    Custom permission to allow only owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in SAFE_METHODS:
            return True

        # All access for admin user
        if request.user.is_staff:
            return True

        # Write permissions are only allowed to the owner of the object
        return obj.id == request.user.id


class IsAdmin(BasePermission):
    """Allow access only to admin users."""

    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class IsSuperAdmin(BasePermission):
    """Allow access only to superadmins."""

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser
