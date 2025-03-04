from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from relation.models import UserRelation


@receiver(post_save, sender=User)
def create_user_relation(sender, instance, created, **kwargs):
    if created:
        UserRelation.objects.create(user=instance)
        print(f"User relation created for {instance.username}")
