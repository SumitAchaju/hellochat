# Generated by Django 5.1.7 on 2025-03-13 05:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile',
            field=models.ImageField(blank=True, default='profile/default_profile.jpg', null=True, upload_to='profile/'),
        ),
    ]
