from django.db import models


class UserRelation(models.Model):
    user = models.OneToOneField(
        "account.User", on_delete=models.CASCADE, related_name="user"
    )
    friends = models.ManyToManyField("account.User", blank=True, related_name="friends")
    requested = models.ManyToManyField(
        "account.User", blank=True, related_name="requested"
    )
    blocked = models.ManyToManyField("account.User", blank=True, related_name="blocked")

    def __str__(self):
        return self.user.username

    def check_blocked(self, user_relation):
        """
        Check if sender or receiver user has blocked each other
        """
        if self.user in user_relation.blocked.all():
            raise ValueError("You are blocked by user")
        if user_relation.user in self.blocked.all():
            raise ValueError("You have blocked user")

    def request(self, user):
        """
        send friend request to other user
        """
        requested_user = UserRelation.objects.get(user=user)
        self.check_blocked(requested_user)
        if user in self.friends.all():
            raise ValueError("You are already friends")
        if self.user in requested_user.requested.all():
            raise ValueError("you have already request from user")
        if user not in self.requested.all():
            self.requested.add(user)

    def unfriend(self, user):
        """
        remove friend from friend list
        """
        requested_user = UserRelation.objects.get(user=user)
        if self.user in requested_user.friends.all():
            requested_user.friends.remove(self.user)
        if user in self.friends.all():
            self.friends.remove(user)

    def block(self, user):
        """
        block user
        """
        if user not in self.blocked.all():
            self.blocked.add(user)

    def unblock(self, user):
        """
        unblock user
        """
        if user in self.blocked.all():
            self.blocked.remove(user)

    def accept(self, user):
        """
        accept friend request
        """
        requested_user = UserRelation.objects.get(user=user)
        self.check_blocked(requested_user)
        if self.user not in requested_user.requested.all():
            raise ValueError("you don't have any request from user")
        if user not in self.friends.all():
            self.friends.add(user)
        if self.user not in requested_user.friends.all():
            requested_user.friends.add(self.user)
        requested_user.requested.remove(self.user)

    def reject(self, user):
        """
        reject friend request
        """
        requested_user = UserRelation.objects.get(user=user)
        if self.user not in requested_user.requested.all():
            raise ValueError("you don't have any request from user")
        requested_user.requested.remove(self.user)

    def cancel_request(self, user):
        """
        cancel friend request
        """
        if user not in self.requested.all():
            raise ValueError("you don't have any request to user")
        self.requested.remove(user)
