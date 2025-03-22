from django.contrib.auth.models import AbstractUser
from django.db import models
from shortuuid import random
from PIL import Image

from account.utils import resize_image


def generate_uid():
    return random(length=32)


class User(AbstractUser):
    uid = models.CharField(
        max_length=32, unique=True, default=generate_uid, editable=False
    )
    email = models.EmailField(unique=True, blank=False)
    address = models.CharField(max_length=255, blank=True, null=True)
    profile = models.ImageField(
        upload_to="profile/",
        blank=True,
        null=True,
        default="profile/default_profile.jpg",
    )
    contact_number = models.CharField(max_length=10, unique=True)
    contact_number_country_code = models.CharField(max_length=3)

    REQUIRED_FIELDS = [
        "email",
        "first_name",
        "last_name",
        "contact_number",
        "contact_number_country_code",
    ]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.profile:
            with Image.open(self.profile) as img:
                resize_image(img, (300, 300)).save(self.profile.path)

    def __str__(self):
        return self.username
