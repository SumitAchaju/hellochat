from django.contrib.auth.models import AbstractUser
from django.db import models
from shortuuid import random


def generate_uid():
    return random(length=32)


class User(AbstractUser):
    uid = models.CharField(
        max_length=32, unique=True, default=generate_uid, editable=False
    )
    email = models.EmailField(unique=True, blank=False)
    address = models.CharField(max_length=255, blank=True, null=True)
    profile = models.ImageField(upload_to="profile/", blank=True, null=True)
    contact_number = models.BigIntegerField(unique=True)
    contact_number_country_code = models.IntegerField()

    REQUIRED_FIELDS = [
        "email",
        "first_name",
        "last_name",
        "contact_number",
        "contact_number_country_code",
    ]

    def __str__(self):
        return self.username
