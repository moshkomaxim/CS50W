# Generated by Django 5.0.2 on 2024-03-31 13:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0007_post_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='title',
        ),
    ]
